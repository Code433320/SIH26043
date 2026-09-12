"""
duplicate_detection.py

Compares a new problem's embedding against previously seen problems using
cosine similarity, to flag duplicates or closely related submissions.

Because embeddings are normalized (normalize_embeddings=True in
embeddings.py), cosine similarity is just a dot product -- so this module
stays fast even with a few thousand stored problems, using a single matrix
multiplication instead of a per-item loop.
"""

from dataclasses import dataclass, field
from typing import Optional

import numpy as np

from src.config import DUPLICATE_SIMILARITY_THRESHOLD, SIMILAR_THRESHOLD


@dataclass
class DuplicateMatch:
    is_duplicate: bool
    is_similar: bool
    matched_problem_id: Optional[str]
    similarity_score: float


@dataclass
class DuplicateDetector:
    """
    Holds embeddings for previously seen problems and checks new problems
    against them. This is intentionally a plain in-memory store (a list of
    ids + a numpy matrix of embeddings) -- see pipeline.py for how it's
    persisted to disk between API restarts via joblib.
    """

    duplicate_threshold: float = DUPLICATE_SIMILARITY_THRESHOLD
    similar_threshold: float = SIMILAR_THRESHOLD
    _ids: list = field(default_factory=list)
    _embeddings: Optional[np.ndarray] = None

    def check(self, embedding: np.ndarray) -> DuplicateMatch:
        """
        Compares `embedding` against every stored problem and returns the
        closest match. Call this BEFORE add(), otherwise a problem will
        always match itself with similarity 1.0.
        """
        if self._embeddings is None or len(self._ids) == 0:
            return DuplicateMatch(
                is_duplicate=False,
                is_similar=False,
                matched_problem_id=None,
                similarity_score=0.0,
            )

        # Embeddings are already unit-normalized, so cosine similarity is
        # just the dot product against every stored row at once.
        similarities = self._embeddings @ embedding
        best_idx = int(np.argmax(similarities))
        best_score = float(similarities[best_idx])

        return DuplicateMatch(
            is_duplicate=best_score >= self.duplicate_threshold,
            is_similar=best_score >= self.similar_threshold,
            matched_problem_id=self._ids[best_idx],
            similarity_score=round(best_score, 4),
        )

    def add(self, problem_id: str, embedding: np.ndarray) -> None:
        """Adds a problem's embedding to the store."""
        embedding = embedding.reshape(1, -1)
        if self._embeddings is None:
            self._embeddings = embedding.copy()
        else:
            self._embeddings = np.vstack([self._embeddings, embedding])
        self._ids.append(problem_id)

    def __len__(self) -> int:
        return len(self._ids)
