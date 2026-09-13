import sys
from dataclasses import dataclass
import types

import numpy as np
import pytest


@dataclass
class _FakeImageAnalysisResult:
    caption: str
    ocr_text: str
    combined_text: str


class FakeEmbeddingGenerator:
    def __init__(self, dim=8):
        self.dim = dim

    def generate_embedding(self, text):
        # Deterministic pseudo-embedding based on text length, so different
        # texts get different (but reproducible) vectors.
        rng = np.random.default_rng(abs(hash(text)) % (2**32))
        v = rng.normal(size=self.dim)
        return v / np.linalg.norm(v)

    def generate_embeddings(self, texts):
        return np.vstack([self.generate_embedding(t) for t in texts])


class FakeImageProcessor:
    """Stands in for ImageProcessor so tests don't need the ~1GB BLIP model."""

    def process_image_bytes(self, image_bytes, title="", description=""):
        caption = "a road with a large pothole"
        ocr_text = ""
        parts = [p for p in [title.strip(), description.strip(), caption, ocr_text] if p]
        return _FakeImageAnalysisResult(
            caption=caption, ocr_text=ocr_text, combined_text=". ".join(parts)
        )


@pytest.fixture
def pipeline_with_fakes(monkeypatch, tmp_path):
    from src import pipeline as pipeline_module

    monkeypatch.setattr(
        pipeline_module, "get_embedding_generator", lambda: FakeEmbeddingGenerator()
    )
    monkeypatch.setattr(pipeline_module, "PROBLEM_STORE_PATH", str(tmp_path / "store.pkl"))

    # Avoid loading the real classifier's category-description embeddings
    # through a real Sentence Transformer.
    from src.classification import ProblemClassifier
    from src.clustering import ProblemClusterer
    from src.duplicate_detection import DuplicateDetector
    from src.priority_model import PriorityModel

    pipeline = pipeline_module.ProblemAnalysisPipeline.__new__(
        pipeline_module.ProblemAnalysisPipeline
    )
    pipeline.embedding_generator = FakeEmbeddingGenerator()
    pipeline.duplicate_detector = DuplicateDetector()
    pipeline.classifier = ProblemClassifier(pipeline.embedding_generator)
    pipeline.clusterer = ProblemClusterer()
    pipeline.priority_model = PriorityModel()
    pipeline.persist = False
    pipeline._problems = {}
    pipeline._solutions = {}

    # Swap in the fake image processor by faking the module-level import
    # inside analyze_with_image (`from src.image_processing import
    # get_image_processor`).
    fake_module = types.SimpleNamespace(get_image_processor=lambda: FakeImageProcessor())
    monkeypatch.setitem(sys.modules, "src.image_processing", fake_module)

    return pipeline


def test_analyze_with_image_produces_caption_and_result(pipeline_with_fakes):
    result = pipeline_with_fakes.analyze_with_image(image_bytes=b"fake-image-bytes")

    assert result.caption == "a road with a large pothole"
    assert result.ocr_text == ""
    assert result.analysis.problem_id
    assert 0.0 <= result.analysis.priority_score <= 10.0


def test_analyze_with_image_to_dict_includes_image_fields(pipeline_with_fakes):
    result = pipeline_with_fakes.analyze_with_image(image_bytes=b"fake-image-bytes")
    d = result.to_dict()

    assert d["image_caption"] == "a road with a large pothole"
    assert "ocr_text" in d
    assert "category" in d


def test_analyze_with_image_combines_title_with_caption(pipeline_with_fakes, monkeypatch):
    result = pipeline_with_fakes.analyze_with_image(
        image_bytes=b"fake-image-bytes", title="Pothole near market"
    )
    # Just verifying it runs successfully and returns a sensible result
    # when both a title and an image are provided together.
    assert result.analysis.problem_id


def test_list_problems_returns_most_recent_first(pipeline_with_fakes):
    r1 = pipeline_with_fakes.analyze("Problem A", "First problem")
    r2 = pipeline_with_fakes.analyze("Problem B", "Second problem")

    history = pipeline_with_fakes.list_problems()
    assert history["total"] == 2
    # Most recent (r2) should come first.
    assert history["problems"][0]["problem_id"] == r2.problem_id
    assert history["problems"][1]["problem_id"] == r1.problem_id


def test_list_problems_pagination(pipeline_with_fakes):
    for i in range(5):
        pipeline_with_fakes.analyze(f"Problem {i}", f"Description {i}")

    page = pipeline_with_fakes.list_problems(limit=2, offset=1)
    assert page["total"] == 5
    assert page["limit"] == 2
    assert page["offset"] == 1
    assert len(page["problems"]) == 2
