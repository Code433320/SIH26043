"""
clustering.py

Groups semantically similar problems together without predefined labels,
using HDBSCAN (falls back to scikit-learn's DBSCAN if hdbscan isn't
installed, e.g. on a platform where it fails to build -- this keeps the
service usable even if that optional dependency is unavailable).

Clustering re-fits over all stored problems each time a new one is added.
This is fine up to a few thousand problems (HDBSCAN is fast); if the
dataset grows much larger than that, swap this for an incremental/online
approach.
"""

from dataclasses import dataclass
from typing import Optional

import numpy as np

from src.config import HDBSCAN_MIN_CLUSTER_SIZE, HDBSCAN_MIN_SAMPLES

try:
    import hdbscan as hdbscan_lib

    _HDBSCAN_AVAILABLE = True
except ImportError:
    _HDBSCAN_AVAILABLE = False


@dataclass
class ClusteringResult:
    cluster_id: int  # -1 means "noise" / not part of any cluster
    algorithm: str


class ProblemClusterer:
    def __init__(
        self,
        min_cluster_size: int = HDBSCAN_MIN_CLUSTER_SIZE,
        min_samples: int = HDBSCAN_MIN_SAMPLES,
    ):
        self.min_cluster_size = min_cluster_size
        self.min_samples = min_samples
        self._labels: Optional[np.ndarray] = None
        self._algorithm = "hdbscan" if _HDBSCAN_AVAILABLE else "dbscan"

    def fit(self, embeddings: np.ndarray) -> np.ndarray:
        """
        Re-clusters the full set of stored embeddings and returns a cluster
        label per row (-1 = noise). Call this whenever a new problem is
        added to the store (see pipeline.py).
        """
        n = embeddings.shape[0] if embeddings is not None else 0

        # Too few points to form any real cluster -- everything is noise.
        if n < self.min_cluster_size:
            self._labels = np.full(n, -1, dtype=int)
            return self._labels

        if _HDBSCAN_AVAILABLE:
            clusterer = hdbscan_lib.HDBSCAN(
                min_cluster_size=self.min_cluster_size,
                min_samples=self.min_samples,
                metric="euclidean",
            )
            self._labels = clusterer.fit_predict(embeddings)
        else:
            from sklearn.cluster import DBSCAN

            # eps chosen for normalized MiniLM embeddings; tune if you
            # change the embedding model.
            clusterer = DBSCAN(eps=0.4, min_samples=self.min_samples, metric="cosine")
            self._labels = clusterer.fit_predict(embeddings)

        return self._labels

    def cluster_id_for(self, index: int) -> ClusteringResult:
        """Returns the cluster assigned to the embedding at `index` after fit()."""
        if self._labels is None or index >= len(self._labels):
            return ClusteringResult(cluster_id=-1, algorithm=self._algorithm)
        return ClusteringResult(
            cluster_id=int(self._labels[index]), algorithm=self._algorithm
        )

    @property
    def algorithm(self) -> str:
        return self._algorithm
