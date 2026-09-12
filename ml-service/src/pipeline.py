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
from src.config import PROBLEM_STORE_PATH
from src.duplicate_detection import DuplicateDetector
from src.embeddings import get_embedding_generator
from src.preprocessing import prepare_problem_text, validate_problem_text
from src.priority_model import PriorityModel


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


class ProblemAnalysisPipeline:
    def __init__(self, persist: bool = True):
        self.embedding_generator = get_embedding_generator()
        self.duplicate_detector = DuplicateDetector()
        self.classifier = ProblemClassifier(self.embedding_generator)
        self.clusterer = ProblemClusterer()
        self.priority_model = PriorityModel()

        self.persist = persist
        self._problems: dict[str, StoredProblem] = {}

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

        embedding = self.embedding_generator.generate_embedding(text)

        # Duplicate check must happen BEFORE this problem is added to the
        # store, otherwise it would always match itself.
        dup_match = self.duplicate_detector.check(embedding)

        classification = self.classifier.classify(embedding)
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
        }

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

    def _load_store(self) -> None:
        if not os.path.exists(PROBLEM_STORE_PATH):
            return
        try:
            data = joblib.load(PROBLEM_STORE_PATH)
            self._problems = data.get("problems", {})
            self.duplicate_detector._ids = data.get("duplicate_ids", [])
            self.duplicate_detector._embeddings = data.get("duplicate_embeddings")
            if self.duplicate_detector._embeddings is not None:
                self.clusterer.fit(self.duplicate_detector._embeddings)
        except Exception as exc:  # noqa: BLE001 - corrupt store shouldn't crash startup
            print(f"Could not load problem store ({exc}); starting fresh.")


_pipeline_singleton: Optional[ProblemAnalysisPipeline] = None


def get_pipeline() -> ProblemAnalysisPipeline:
    """Process-wide singleton, so the API only builds/loads this once."""
    global _pipeline_singleton
    if _pipeline_singleton is None:
        _pipeline_singleton = ProblemAnalysisPipeline()
    return _pipeline_singleton


def reset_store() -> None:
    """
    Deletes the persisted problem store and resets the in-memory pipeline
    singleton, so the next get_pipeline() call starts with an empty
    dataset. Useful for demos/testing -- NOT something the API should call
    on every request, since that would defeat duplicate detection entirely.
    """
    global _pipeline_singleton
    if os.path.exists(PROBLEM_STORE_PATH):
        os.remove(PROBLEM_STORE_PATH)
    _pipeline_singleton = None
