"""
solution_evaluation.py

This is Pipeline 2 -- separate from the problem pipeline in pipeline.py.

Pipeline 1 (already built): a citizen submits a PROBLEM -> category,
priority, duplicate check, cluster.

Pipeline 2 (this file): once a problem exists, universities/govt
bodies/NGOs submit PROPOSED SOLUTIONS to it -> each solution gets scored
and ranked against the others, so reviewers can see the best option
first instead of reading every proposal in submission order.

A solution is scored on five factors (weights in src/config.py):

- relevance:     does the plan's text actually address THIS problem?
                  (embedding similarity between the solution's plan and
                  the original problem -- catches copy-pasted or
                  generic proposals that don't really fit)
- cost:          lower estimated cost is better
- time:          shorter estimated timeline is better
- track_record:  more relevant past experience is better
- profit:        lower profit margin is better (more of the budget goes
                  toward the actual solution, less toward margin)

cost/time/track_record/profit are scored RELATIVE to the other solutions
proposed for the SAME problem (min-max normalized within that group),
not against some fixed universal scale -- because "₹50,000" is expensive
for fixing one street light but cheap for rebuilding a bridge. Relevance
is the only factor scored in absolute terms, since it's a similarity to
the problem itself, not to other solutions.

Like priority_model.py and classification.py, this ships with a working
heuristic (no training data needed) and has room to become a trained
model (e.g. learning-to-rank) once historical "which solution actually
got approved / worked well" data exists.
"""

from dataclasses import dataclass
from typing import List, Optional

import numpy as np

from src.config import SOLUTION_RELEVANCE_WARNING_THRESHOLD, SOLUTION_WEIGHTS


@dataclass
class SolutionInput:
    solution_id: str
    organization: str
    plan_text: str
    estimated_cost: float
    estimated_time_days: float
    track_record: float  # 0-10, e.g. "how many similar projects has this org done well"
    expected_profit_percent: float  # 0-100


@dataclass
class ScoredSolution:
    solution_id: str
    organization: str
    final_score: float  # 0-10, higher = better
    relevance_score: float
    cost_score: float
    time_score: float
    track_record_score: float
    profit_score: float
    relevance_similarity: float  # raw cosine similarity, for transparency
    low_relevance_warning: bool

    def to_dict(self) -> dict:
        return {
            "solution_id": self.solution_id,
            "organization": self.organization,
            "final_score": self.final_score,
            "breakdown": {
                "relevance": self.relevance_score,
                "cost": self.cost_score,
                "time": self.time_score,
                "track_record": self.track_record_score,
                "profit": self.profit_score,
            },
            "relevance_similarity": self.relevance_similarity,
            "low_relevance_warning": self.low_relevance_warning,
        }


def _min_max_normalize(values: List[float], invert: bool = False) -> List[float]:
    """
    Scales a list of numbers to 0-10 relative to each other. invert=True
    means the SMALLEST input value gets the HIGHEST score (used for cost,
    time, and profit, where lower is better).

    If every value is the same (including a group of exactly one
    solution), there's nothing to compare -- everyone gets a neutral 5.0
    rather than an arbitrary 0 or 10.
    """
    if not values:
        return []

    lo, hi = min(values), max(values)
    if hi == lo:
        return [5.0 for _ in values]

    scaled = [(v - lo) / (hi - lo) for v in values]
    if invert:
        scaled = [1 - s for s in scaled]
    return [round(s * 10, 2) for s in scaled]


class SolutionEvaluator:
    def __init__(self, embedding_generator):
        self.embedding_generator = embedding_generator

    def score_solutions(
        self,
        problem_embedding: np.ndarray,
        solutions: List[SolutionInput],
        solution_embeddings: Optional[List[np.ndarray]] = None,
    ) -> List[ScoredSolution]:
        """
        Scores every solution proposed for one problem, relative to each
        other, and returns them ranked best-first.

        solution_embeddings can be passed in if already computed (e.g. by
        the pipeline, which also stores them) to avoid re-embedding; if
        not given, this method embeds each solution's plan_text itself.
        """
        if not solutions:
            return []

        if solution_embeddings is None:
            solution_embeddings = self.embedding_generator.generate_embeddings(
                [s.plan_text for s in solutions]
            )

        # Relevance: cosine similarity between each solution's plan and the
        # original problem (embeddings are normalized, so this is a dot
        # product -- same trick used in duplicate_detection.py).
        relevance_similarities = [
            float(problem_embedding @ emb) for emb in solution_embeddings
        ]
        relevance_scores = [
            round(max(0.0, min(1.0, sim)) * 10, 2) for sim in relevance_similarities
        ]

        costs = [s.estimated_cost for s in solutions]
        times = [s.estimated_time_days for s in solutions]
        track_records = [s.track_record for s in solutions]
        profits = [s.expected_profit_percent for s in solutions]

        cost_scores = _min_max_normalize(costs, invert=True)
        time_scores = _min_max_normalize(times, invert=True)
        track_scores = _min_max_normalize(track_records, invert=False)
        profit_scores = _min_max_normalize(profits, invert=True)

        results = []
        for i, solution in enumerate(solutions):
            final = (
                SOLUTION_WEIGHTS["relevance"] * relevance_scores[i]
                + SOLUTION_WEIGHTS["cost"] * cost_scores[i]
                + SOLUTION_WEIGHTS["time"] * time_scores[i]
                + SOLUTION_WEIGHTS["track_record"] * track_scores[i]
                + SOLUTION_WEIGHTS["profit"] * profit_scores[i]
            )

            results.append(
                ScoredSolution(
                    solution_id=solution.solution_id,
                    organization=solution.organization,
                    final_score=round(final, 2),
                    relevance_score=relevance_scores[i],
                    cost_score=cost_scores[i],
                    time_score=time_scores[i],
                    track_record_score=track_scores[i],
                    profit_score=profit_scores[i],
                    relevance_similarity=round(relevance_similarities[i], 4),
                    low_relevance_warning=relevance_similarities[i]
                    < SOLUTION_RELEVANCE_WARNING_THRESHOLD,
                )
            )

        results.sort(key=lambda r: r.final_score, reverse=True)
        return results
