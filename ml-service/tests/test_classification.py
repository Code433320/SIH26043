import numpy as np

from src.classification import ProblemClassifier
from src.config import CATEGORY_LABELS


class FakeEmbeddingGenerator:
    """
    Produces deterministic, well-separated one-hot-ish embeddings so we can
    test the zero-shot classification LOGIC without downloading the real
    Sentence Transformer model (keeps this test fast and offline-friendly).
    """

    def __init__(self, dim):
        self.dim = dim
        self._counter = 0

    def generate_embeddings(self, texts):
        # Category descriptions: each gets its own orthogonal-ish basis vector.
        n = len(texts)
        mat = np.eye(n, self.dim)
        norms = np.linalg.norm(mat, axis=1, keepdims=True)
        norms[norms == 0] = 1
        return mat / norms

    def generate_embedding(self, text):
        # Return a vector that closely matches category index 0's basis
        # vector, i.e. should classify as the first category.
        v = np.zeros(self.dim)
        v[0] = 1.0
        return v


def test_zero_shot_classifies_to_closest_category():
    n_categories = len(CATEGORY_LABELS)
    fake_gen = FakeEmbeddingGenerator(dim=max(n_categories, 8))
    classifier = ProblemClassifier(fake_gen)

    embedding = fake_gen.generate_embedding("anything")
    result = classifier.classify(embedding)

    assert result.category == CATEGORY_LABELS[0]
    assert result.method == "zero_shot"
    assert 0.0 <= result.confidence <= 1.0
