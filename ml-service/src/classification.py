"""
classification.py

Assigns a problem to a category (Water and Sanitation, Health, Education...).

Two modes, chosen automatically:

1. Zero-shot (default, no training data needed):
   Each category has a short description (src/config.py). We embed those
   descriptions once and compare a new problem's embedding to each of them
   with cosine similarity -- the closest category wins. This works from day
   one with zero labelled data, which matters a lot at this stage of the
   project.

2. Trained (automatic upgrade once you have labelled data):
   If data/sample_problems.csv has a 'category' column with enough labelled
   rows, run `python -m src.classification` to train a logistic regression
   classifier on top of the embeddings and save it to models/. The API will
   then use that instead -- it's more accurate once you have real labels,
   because it learns from your actual category boundaries instead of a
   generic description.
"""

import os
from dataclasses import dataclass
from typing import Optional

import joblib
import numpy as np

from src.config import CATEGORY_DESCRIPTIONS, CATEGORY_LABELS, CLASSIFIER_MODEL_PATH


@dataclass
class ClassificationResult:
    category: str
    confidence: float
    method: str  # "zero_shot" or "trained_model"


class ProblemClassifier:
    def __init__(self, embedding_generator):
        self.embedding_generator = embedding_generator
        self._category_embeddings = self.embedding_generator.generate_embeddings(
            list(CATEGORY_DESCRIPTIONS.values())
        )
        self._trained_model = self._load_trained_model()

    def _load_trained_model(self):
        if os.path.exists(CLASSIFIER_MODEL_PATH):
            try:
                return joblib.load(CLASSIFIER_MODEL_PATH)
            except Exception as exc:  # noqa: BLE001 - defensive, log and fall back
                print(f"Could not load trained classifier ({exc}); using zero-shot.")
        return None

    def classify(self, embedding: np.ndarray) -> ClassificationResult:
        if self._trained_model is not None:
            return self._classify_trained(embedding)
        return self._classify_zero_shot(embedding)

    def _classify_zero_shot(self, embedding: np.ndarray) -> ClassificationResult:
        similarities = self._category_embeddings @ embedding
        best_idx = int(np.argmax(similarities))
        # Softmax over similarities gives an interpretable confidence value
        # rather than a raw cosine score, which can look artificially low.
        exp_scores = np.exp((similarities - similarities.max()) * 10)
        probs = exp_scores / exp_scores.sum()

        return ClassificationResult(
            category=CATEGORY_LABELS[best_idx],
            confidence=round(float(probs[best_idx]), 4),
            method="zero_shot",
        )

    def _classify_trained(self, embedding: np.ndarray) -> ClassificationResult:
        probs = self._trained_model.predict_proba(embedding.reshape(1, -1))[0]
        best_idx = int(np.argmax(probs))
        category = self._trained_model.classes_[best_idx]

        return ClassificationResult(
            category=str(category),
            confidence=round(float(probs[best_idx]), 4),
            method="trained_model",
        )


def train_from_csv(csv_path: str = "data/sample_problems.csv") -> Optional[str]:
    """
    Trains a logistic regression classifier on top of embeddings, using
    labelled data from a CSV with 'title', 'description', 'category'
    columns. Saves the model to models/classifier_model.joblib.

    Returns the path the model was saved to, or None if training was
    skipped (e.g. not enough labelled data yet -- this is expected early in
    the project and is not an error).
    """
    import pandas as pd
    from sklearn.linear_model import LogisticRegression

    from src.embeddings import get_embedding_generator
    from src.preprocessing import prepare_problem_text

    if not os.path.exists(csv_path):
        print(f"No training data found at {csv_path}; skipping classifier training.")
        return None

    df = pd.read_csv(csv_path)
    if "category" not in df.columns:
        print("CSV has no 'category' column; skipping classifier training.")
        return None

    df = df.dropna(subset=["category"])
    if len(df) < 20 or df["category"].nunique() < 2:
        print(
            f"Only {len(df)} labelled rows across {df['category'].nunique()} "
            "categories -- need more data for a reliable trained classifier. "
            "Using zero-shot classification for now."
        )
        return None

    embedder = get_embedding_generator()
    texts = [
        prepare_problem_text(row.get("title", ""), row.get("description", ""))
        for _, row in df.iterrows()
    ]
    X = embedder.generate_embeddings(texts)
    y = df["category"].values

    model = LogisticRegression(max_iter=1000, class_weight="balanced")
    model.fit(X, y)

    os.makedirs(os.path.dirname(CLASSIFIER_MODEL_PATH), exist_ok=True)
    joblib.dump(model, CLASSIFIER_MODEL_PATH)
    print(f"Trained classifier saved to {CLASSIFIER_MODEL_PATH}")
    return CLASSIFIER_MODEL_PATH


if __name__ == "__main__":
    train_from_csv()
