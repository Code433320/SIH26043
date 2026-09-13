import numpy as np

from src.classification import ProblemClassifier
from src.config import CATEGORY_LABELS


class FakeEmbeddingGenerator:
    """Same deterministic basis-vector generator as test_classification.py."""

    def __init__(self, dim):
        self.dim = dim

    def generate_embeddings(self, texts):
        n = len(texts)
        mat = np.eye(n, self.dim)
        norms = np.linalg.norm(mat, axis=1, keepdims=True)
        norms[norms == 0] = 1
        return mat / norms

    def generate_embedding(self, text):
        v = np.zeros(self.dim)
        v[0] = 1.0
        return v


def test_classify_top_n_returns_n_results_best_first():
    n_categories = len(CATEGORY_LABELS)
    fake_gen = FakeEmbeddingGenerator(dim=max(n_categories, 8))
    classifier = ProblemClassifier(fake_gen)

    embedding = fake_gen.generate_embedding("anything")
    results = classifier.classify_top_n(embedding, n=3)

    assert len(results) == 3
    # Best-first: confidences should be non-increasing.
    confidences = [r.confidence for r in results]
    assert confidences == sorted(confidences, reverse=True)
    # The single best should match what classify() (n=1) returns.
    assert results[0].category == classifier.classify(embedding).category


def test_classify_top_n_n1_matches_classify():
    n_categories = len(CATEGORY_LABELS)
    fake_gen = FakeEmbeddingGenerator(dim=max(n_categories, 8))
    classifier = ProblemClassifier(fake_gen)

    embedding = fake_gen.generate_embedding("anything")
    top1 = classifier.classify_top_n(embedding, n=1)
    single = classifier.classify(embedding)

    assert len(top1) == 1
    assert top1[0].category == single.category
    assert top1[0].confidence == single.confidence
