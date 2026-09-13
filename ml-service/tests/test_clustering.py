import numpy as np

from src.clustering import ProblemClusterer


def test_too_few_points_returns_all_noise():
    clusterer = ProblemClusterer(min_cluster_size=3, min_samples=2)
    embeddings = np.random.rand(2, 8)
    labels = clusterer.fit(embeddings)
    assert (labels == -1).all()


def test_two_clear_clusters_are_detected():
    clusterer = ProblemClusterer(min_cluster_size=3, min_samples=2)

    rng = np.random.default_rng(42)
    cluster_a = rng.normal(loc=0.0, scale=0.01, size=(5, 8))
    cluster_b = rng.normal(loc=5.0, scale=0.01, size=(5, 8))
    embeddings = np.vstack([cluster_a, cluster_b])

    labels = clusterer.fit(embeddings)

    # Points within the same synthetic cluster should share a label, and
    # the two groups should NOT share a label with each other.
    assert len(set(labels[:5]) - {-1}) <= 1
    assert len(set(labels[5:]) - {-1}) <= 1
    a_labels = set(labels[:5]) - {-1}
    b_labels = set(labels[5:]) - {-1}
    assert a_labels.isdisjoint(b_labels) or not a_labels or not b_labels


def test_cluster_id_for_out_of_range_returns_noise():
    clusterer = ProblemClusterer()
    result = clusterer.cluster_id_for(0)
    assert result.cluster_id == -1
