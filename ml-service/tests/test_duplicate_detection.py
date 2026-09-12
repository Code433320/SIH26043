import numpy as np

from src.duplicate_detection import DuplicateDetector


def unit_vector(v):
    return v / np.linalg.norm(v)


def test_no_duplicates_when_store_empty():
    detector = DuplicateDetector()
    result = detector.check(unit_vector(np.array([1.0, 0.0, 0.0])))
    assert result.is_duplicate is False
    assert result.matched_problem_id is None


def test_detects_identical_embedding_as_duplicate():
    detector = DuplicateDetector()
    v = unit_vector(np.array([1.0, 0.0, 0.0]))
    detector.add("p1", v)

    result = detector.check(v)
    assert result.is_duplicate is True
    assert result.matched_problem_id == "p1"
    assert result.similarity_score == 1.0


def test_dissimilar_embedding_not_flagged():
    detector = DuplicateDetector()
    detector.add("p1", unit_vector(np.array([1.0, 0.0, 0.0])))

    orthogonal = unit_vector(np.array([0.0, 1.0, 0.0]))
    result = detector.check(orthogonal)
    assert result.is_duplicate is False
    assert result.is_similar is False


def test_store_grows_with_add():
    detector = DuplicateDetector()
    assert len(detector) == 0
    detector.add("p1", unit_vector(np.array([1.0, 0.0])))
    detector.add("p2", unit_vector(np.array([0.0, 1.0])))
    assert len(detector) == 2
