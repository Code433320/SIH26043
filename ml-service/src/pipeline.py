"""
pipeline.py

Combines preprocessing, embeddings, duplicate detection, classification,
clustering, and priority prediction into one reusable pipeline -- this is
what api.py calls, and it's also usable directly from a notebook or
main.py without needing the API running.

State (previously seen problems, for duplicate detection and clustering) is
kept in memory and persisted to models/problem_store.pkl via joblib, so
restarting the API (`--reload` during development, or a real deploy) doesn't
throw away everything it has learned.
"""

import os
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

import joblib
import numpy as np

from src.classification import ProblemClassifier
from src.clustering import ProblemClusterer
from src.config import PROBLEM_STORE_PATH, SOLUTION_STORE_PATH
from src.duplicate_detection import DuplicateDetector
from src.embeddings import get_embedding_generator
from src.preprocessing import clean_text, prepare_problem_text, validate_problem_text
from src.priority_model import PriorityModel
from src.solution_evaluation import ScoredSolution, SolutionEvaluator, SolutionInput


@dataclass
class StoredProblem:
    id: str
    title: str
    description: str
    embedding: np.ndarray
    category: str
    priority_score: float
    cluster_id: int
    created_at: str


@dataclass
class AnalysisResult:
    problem_id: str
    category: str
    category_confidence: float
    classification_method: str
    top_categories: list  # [{"category": str, "confidence": float}, ...], best first
    priority_score: float
    priority_method: str
    is_duplicate: bool
    is_similar: bool
    duplicate_of: Optional[str]
    similarity_score: float
    cluster_id: int
    clustering_algorithm: str
    embedding_size: int

    def to_dict(self) -> dict:
        return {
            "problem_id": self.problem_id,
            "category": self.category,
            "category_confidence": self.category_confidence,
            "classification_method": self.classification_method,
            "top_categories": self.top_categories,
            "priority_score": self.priority_score,
            "priority_method": self.priority_method,
            "is_duplicate": self.is_duplicate,
            "is_similar": self.is_similar,
            "duplicate_of": self.duplicate_of,
            "similarity_score": self.similarity_score,
            "cluster_id": self.cluster_id,
            "clustering_algorithm": self.clustering_algorithm,
            "embedding_size": self.embedding_size,
        }


@dataclass
class ImageAnalysisAPIResult:
    """
    Wraps a normal AnalysisResult with the extra info that only exists
    when the input was an image: the AI-generated caption and any OCR'd
    text. Kept as a separate dataclass (rather than adding these fields
    to AnalysisResult itself) so text-only responses stay exactly as
    they were -- nothing about the existing /analyze-problem contract
    changes.
    """

    analysis: AnalysisResult
    caption: str
    ocr_text: str

    def to_dict(self) -> dict:
        result = self.analysis.to_dict()
        result["image_caption"] = self.caption
        result["ocr_text"] = self.ocr_text
        return result


@dataclass
class StoredSolution:
    id: str
    problem_id: str
    organization: str
    plan_text: str
    embedding: np.ndarray
    estimated_cost: float
    estimated_time_days: float
    track_record: float
    expected_profit_percent: float
    created_at: str


class ProblemAnalysisPipeline:
    def __init__(self, persist: bool = True):
        self.embedding_generator = get_embedding_generator()
        self.duplicate_detector = DuplicateDetector()
        self.classifier = ProblemClassifier(self.embedding_generator)
        self.clusterer = ProblemClusterer()
        self.priority_model = PriorityModel()
        self.solution_evaluator = SolutionEvaluator(self.embedding_generator)

        self.persist = persist
        self._problems: dict[str, StoredProblem] = {}
        # problem_id -> list[StoredSolution], for Pipeline 2 (solution ranking).
        self._solutions: dict[str, list] = {}

        if self.persist:
            self._load_store()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def analyze(
        self,
        title: str,
        description: str,
        affected_people: Optional[int] = None,
        severity: Optional[float] = None,
        urgency: Optional[float] = None,
        store_result: bool = True,
    ) -> AnalysisResult:
        """
        Runs the full pipeline on one problem submission and returns a
        structured result. Set store_result=False to analyze a problem
        (e.g. for a "preview" endpoint) without adding it to the dataset
        used for future duplicate detection / clustering.
        """
        validate_problem_text(title, description)
        text = prepare_problem_text(title, description)

        return self._run_pipeline(
            text=text,
            title=title,
            description=description,
            affected_people=affected_people,
            severity=severity,
            urgency=urgency,
            store_result=store_result,
        )

    def analyze_with_image(
        self,
        image_bytes: bytes,
        title: str = "",
        description: str = "",
        affected_people: Optional[int] = None,
        severity: Optional[float] = None,
        urgency: Optional[float] = None,
        store_result: bool = True,
    ) -> ImageAnalysisAPIResult:
        """
        Same idea as analyze(), but for a photo instead of (or alongside)
        typed text. The image is converted to text first -- an AI caption
        of what's in the photo, plus any text OCR'd out of it -- combined
        with whatever title/description was also typed. That combined
        text is then run through the exact same pipeline as a normal
        text submission, so duplicate detection, classification,
        clustering, and priority scoring all work identically regardless
        of whether the problem arrived as text or as a photo.
        """
        from src.image_processing import get_image_processor

        image_processor = get_image_processor()
        image_result = image_processor.process_image_bytes(image_bytes, title, description)

        if not image_result.combined_text.strip():
            raise ValueError(
                "Could not get any usable text from the image, title, or "
                "description. Try a clearer photo or add a short title."
            )

        analysis = self._run_pipeline(
            text=image_result.combined_text,
            title=title or image_result.caption,
            description=description,
            affected_people=affected_people,
            severity=severity,
            urgency=urgency,
            store_result=store_result,
        )

        return ImageAnalysisAPIResult(
            analysis=analysis, caption=image_result.caption, ocr_text=image_result.ocr_text
        )

    def _run_pipeline(
        self,
        text: str,
        title: str,
        description: str,
        affected_people: Optional[int],
        severity: Optional[float],
        urgency: Optional[float],
        store_result: bool,
    ) -> AnalysisResult:
        """
        Shared core: takes a single prepared text string (however it was
        produced -- typed, or extracted from an image) through embedding,
        duplicate detection, classification, clustering, and priority
        scoring. Both analyze() and analyze_with_image() call this so
        there's exactly one implementation of the actual pipeline logic.
        """
        embedding = self.embedding_generator.generate_embedding(text)

        # Duplicate check must happen BEFORE this problem is added to the
        # store, otherwise it would always match itself.
        dup_match = self.duplicate_detector.check(embedding)

        classification_candidates = self.classifier.classify_top_n(embedding, n=2)
        classification = classification_candidates[0]
        priority = self.priority_model.predict(affected_people, severity, urgency)

        problem_id = str(uuid.uuid4())

        if store_result:
            self.duplicate_detector.add(problem_id, embedding)
            cluster_labels = self.clusterer.fit(self.duplicate_detector._embeddings)
            cluster_id = int(cluster_labels[-1])

            self._problems[problem_id] = StoredProblem(
                id=problem_id,
                title=title,
                description=description,
                embedding=embedding,
                category=classification.category,
                priority_score=priority.priority_score,
                cluster_id=cluster_id,
                created_at=datetime.now(timezone.utc).isoformat(),
            )
            if self.persist:
                self._save_store()
        else:
            cluster_id = -1

        return AnalysisResult(
            problem_id=problem_id,
            category=classification.category,
            category_confidence=classification.confidence,
            classification_method=classification.method,
            top_categories=[
                {"category": c.category, "confidence": c.confidence}
                for c in classification_candidates
            ],
            priority_score=priority.priority_score,
            priority_method=priority.method,
            is_duplicate=dup_match.is_duplicate,
            is_similar=dup_match.is_similar,
            # Only report a matched problem id when it's actually similar --
            # otherwise this is just "the closest of everything we have",
            # which is meaningless (and confusing) when nothing is close.
            duplicate_of=dup_match.matched_problem_id if dup_match.is_similar else None,
            similarity_score=dup_match.similarity_score,
            cluster_id=cluster_id,
            clustering_algorithm=self.clusterer.algorithm,
            embedding_size=int(embedding.shape[0]),
        )

    def stats(self) -> dict:
        """Summary info -- handy for a dashboard or a health/debug endpoint."""
        cluster_ids = [p.cluster_id for p in self._problems.values()]
        categories = {}
        for p in self._problems.values():
            categories[p.category] = categories.get(p.category, 0) + 1

        return {
            "total_problems": len(self._problems),
            "num_clusters": len({c for c in cluster_ids if c != -1}),
            "num_noise_points": sum(1 for c in cluster_ids if c == -1),
            "categories": categories,
            "total_solutions": sum(len(v) for v in self._solutions.values()),
            "problems_with_solutions": len(self._solutions),
        }

    def list_problems(self, limit: int = 50, offset: int = 0) -> dict:
        """
        Returns previously submitted problems, most recent first. This is
        the "history" view -- /stats only gives counts, this gives the
        actual list. Paginated (limit/offset) since the store could grow
        to thousands of entries in production.
        """
        all_problems = sorted(
            self._problems.values(), key=lambda p: p.created_at, reverse=True
        )
        page = all_problems[offset : offset + limit]

        return {
            "total": len(all_problems),
            "limit": limit,
            "offset": offset,
            "problems": [
                {
                    "problem_id": p.id,
                    "title": p.title,
                    "description": p.description,
                    "category": p.category,
                    "priority_score": p.priority_score,
                    "cluster_id": p.cluster_id,
                    "num_solutions": len(self._solutions.get(p.id, [])),
                    "created_at": p.created_at,
                }
                for p in page
            ],
        }

    # ------------------------------------------------------------------
    # Pipeline 2: Solution evaluation
    # ------------------------------------------------------------------
    def submit_solution(
        self,
        problem_id: str,
        organization: str,
        plan_text: str,
        estimated_cost: float,
        estimated_time_days: float,
        track_record: float = 5.0,
        expected_profit_percent: float = 0.0,
    ) -> str:
        """
        Stores a proposed solution for an existing problem. Raises
        ValueError if problem_id doesn't exist (a solution has to be FOR
        something) or if plan_text is empty (nothing to evaluate).

        Returns the new solution's id.
        """
        if problem_id not in self._problems:
            raise ValueError(f"No problem found with id '{problem_id}'.")

        clean_plan = clean_text(plan_text)
        if not clean_plan:
            raise ValueError("'plan_text' is empty after cleaning.")

        embedding = self.embedding_generator.generate_embedding(clean_plan)
        solution_id = str(uuid.uuid4())

        solution = StoredSolution(
            id=solution_id,
            problem_id=problem_id,
            organization=organization,
            plan_text=plan_text,
            embedding=embedding,
            estimated_cost=estimated_cost,
            estimated_time_days=estimated_time_days,
            track_record=track_record,
            expected_profit_percent=expected_profit_percent,
            created_at=datetime.now(timezone.utc).isoformat(),
        )

        self._solutions.setdefault(problem_id, []).append(solution)
        if self.persist:
            self._save_store()

        return solution_id

    def rank_solutions(self, problem_id: str) -> list:
        """
        Returns every solution submitted for `problem_id`, scored and
        ranked best-first (see src/solution_evaluation.py for how
        scoring works). Returns an empty list if the problem has no
        solutions yet -- that's a normal state, not an error.
        """
        if problem_id not in self._problems:
            raise ValueError(f"No problem found with id '{problem_id}'.")

        stored_solutions = self._solutions.get(problem_id, [])
        if not stored_solutions:
            return []

        problem_embedding = self._problems[problem_id].embedding

        solution_inputs = [
            SolutionInput(
                solution_id=s.id,
                organization=s.organization,
                plan_text=s.plan_text,
                estimated_cost=s.estimated_cost,
                estimated_time_days=s.estimated_time_days,
                track_record=s.track_record,
                expected_profit_percent=s.expected_profit_percent,
            )
            for s in stored_solutions
        ]
        solution_embeddings = [s.embedding for s in stored_solutions]

        return self.solution_evaluator.score_solutions(
            problem_embedding, solution_inputs, solution_embeddings
        )

    # ------------------------------------------------------------------
    # Persistence
    # ------------------------------------------------------------------
    def _save_store(self) -> None:
        os.makedirs(os.path.dirname(PROBLEM_STORE_PATH), exist_ok=True)
        joblib.dump(
            {
                "problems": self._problems,
                "duplicate_ids": self.duplicate_detector._ids,
                "duplicate_embeddings": self.duplicate_detector._embeddings,
            },
            PROBLEM_STORE_PATH,
        )
        joblib.dump({"solutions": self._solutions}, SOLUTION_STORE_PATH)

    def _load_store(self) -> None:
        if os.path.exists(PROBLEM_STORE_PATH):
            try:
                data = joblib.load(PROBLEM_STORE_PATH)
                self._problems = data.get("problems", {})
                self.duplicate_detector._ids = data.get("duplicate_ids", [])
                self.duplicate_detector._embeddings = data.get("duplicate_embeddings")
                if self.duplicate_detector._embeddings is not None:
                    self.clusterer.fit(self.duplicate_detector._embeddings)
            except Exception as exc:  # noqa: BLE001 - corrupt store shouldn't crash startup
                print(f"Could not load problem store ({exc}); starting fresh.")

        if os.path.exists(SOLUTION_STORE_PATH):
            try:
                data = joblib.load(SOLUTION_STORE_PATH)
                self._solutions = data.get("solutions", {})
            except Exception as exc:  # noqa: BLE001 - corrupt store shouldn't crash startup
                print(f"Could not load solution store ({exc}); starting fresh.")


_pipeline_singleton: Optional[ProblemAnalysisPipeline] = None


def get_pipeline() -> ProblemAnalysisPipeline:
    """Process-wide singleton, so the API only builds/loads this once."""
    global _pipeline_singleton
    if _pipeline_singleton is None:
        _pipeline_singleton = ProblemAnalysisPipeline()
    return _pipeline_singleton


def reset_store() -> None:
    """
    Deletes the persisted problem AND solution stores and resets the
    in-memory pipeline singleton, so the next get_pipeline() call starts
    with an empty dataset. Useful for demos/testing -- NOT something the
    API should call on every request, since that would defeat duplicate
    detection entirely.
    """
    global _pipeline_singleton
    if os.path.exists(PROBLEM_STORE_PATH):
        os.remove(PROBLEM_STORE_PATH)
    if os.path.exists(SOLUTION_STORE_PATH):
        os.remove(SOLUTION_STORE_PATH)
    _pipeline_singleton = None
