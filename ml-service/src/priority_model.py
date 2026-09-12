"""
priority_model.py

Estimates a priority score (0-10) for a problem using affected_people,
severity, and urgency.

Two modes, same pattern as classification.py:

1. Heuristic (default, no training data needed):
   A transparent weighted formula (see PRIORITY_WEIGHTS in src/config.py).
   affected_people is log-scaled since impact doesn't grow linearly (10 vs
   110 affected people matters more than 10,000 vs 10,100).

2. Trained (automatic upgrade once you have labelled data):
   If data/sample_problems.csv has a 'priority_score' column, run
   `python -m src.priority_model` to train an XGBoost regressor and save it
   to models/. The API uses that instead once it exists.
"""

import math
import os
from dataclasses import dataclass
from typing import Optional

import joblib
import numpy as np

from src.config import (
    PRIORITY_MODEL_PATH,
    PRIORITY_SCORE_MAX,
    PRIORITY_SCORE_MIN,
    PRIORITY_WEIGHTS,
)


@dataclass
class PriorityResult:
    priority_score: float
    method: str  # "heuristic" or "trained_model"


class PriorityModel:
    def __init__(self):
        self._trained_model = self._load_trained_model()

    def _load_trained_model(self):
        if os.path.exists(PRIORITY_MODEL_PATH):
            try:
                return joblib.load(PRIORITY_MODEL_PATH)
            except Exception as exc:  # noqa: BLE001 - defensive, log and fall back
                print(f"Could not load trained priority model ({exc}); using heuristic.")
        return None

    def predict(
        self,
        affected_people: Optional[int],
        severity: Optional[float],
        urgency: Optional[float],
    ) -> PriorityResult:
        affected_people = affected_people or 0
        severity = severity if severity is not None else 5.0
        urgency = urgency if urgency is not None else 5.0

        if self._trained_model is not None:
            features = np.array([[affected_people, severity, urgency]])
            score = float(self._trained_model.predict(features)[0])
            method = "trained_model"
        else:
            score = self._heuristic_score(affected_people, severity, urgency)
            method = "heuristic"

        score = max(PRIORITY_SCORE_MIN, min(PRIORITY_SCORE_MAX, score))
        return PriorityResult(priority_score=round(score, 2), method=method)

    @staticmethod
    def _heuristic_score(affected_people: int, severity: float, urgency: float) -> float:
        # severity/urgency assumed to already be on a 0-10 scale.
        severity_component = max(0.0, min(10.0, severity))
        urgency_component = max(0.0, min(10.0, urgency))

        # log-scale affected_people, then map onto 0-10. log1p(100000) ~= 11.5,
        # which comfortably covers realistic submission sizes.
        affected_component = min(10.0, math.log1p(max(0, affected_people)) / 11.5 * 10)

        score = (
            PRIORITY_WEIGHTS["severity"] * severity_component
            + PRIORITY_WEIGHTS["urgency"] * urgency_component
            + PRIORITY_WEIGHTS["affected_people"] * affected_component
        )
        return score


def train_from_csv(csv_path: str = "data/sample_problems.csv") -> Optional[str]:
    """
    Trains an XGBoost regressor on labelled priority_score data.
    Returns the save path, or None if training was skipped.
    """
    import pandas as pd
    from xgboost import XGBRegressor

    if not os.path.exists(csv_path):
        print(f"No training data found at {csv_path}; skipping priority model training.")
        return None

    df = pd.read_csv(csv_path)
    required = {"affected_people", "severity", "urgency", "priority_score"}
    if not required.issubset(df.columns):
        print(f"CSV missing columns {required - set(df.columns)}; skipping training.")
        return None

    df = df.dropna(subset=list(required))
    if len(df) < 20:
        print(f"Only {len(df)} labelled rows -- need more data. Using heuristic for now.")
        return None

    X = df[["affected_people", "severity", "urgency"]].values
    y = df["priority_score"].values

    model = XGBRegressor(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.8,
        random_state=42,
    )
    model.fit(X, y)

    os.makedirs(os.path.dirname(PRIORITY_MODEL_PATH), exist_ok=True)
    joblib.dump(model, PRIORITY_MODEL_PATH)
    print(f"Trained priority model saved to {PRIORITY_MODEL_PATH}")
    return PRIORITY_MODEL_PATH


if __name__ == "__main__":
    train_from_csv()
