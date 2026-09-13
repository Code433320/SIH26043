import numpy as np

from src.solution_evaluation import SolutionEvaluator, SolutionInput, _min_max_normalize


def unit_vector(v):
    v = np.array(v, dtype=float)
    return v / np.linalg.norm(v)


class FakeEmbeddingGenerator:
    def generate_embeddings(self, texts):
        # Not used in these tests since we pass solution_embeddings directly,
        # but required to satisfy the interface.
        raise NotImplementedError


def test_min_max_normalize_basic():
    scores = _min_max_normalize([0, 5, 10])
    assert scores[0] == 0.0
    assert scores[1] == 5.0
    assert scores[2] == 10.0


def test_min_max_normalize_invert():
    scores = _min_max_normalize([0, 5, 10], invert=True)
    assert scores[0] == 10.0
    assert scores[2] == 0.0


def test_min_max_normalize_all_equal_returns_neutral():
    scores = _min_max_normalize([5, 5, 5])
    assert scores == [5.0, 5.0, 5.0]


def test_cheaper_faster_more_relevant_solution_ranks_higher():
    evaluator = SolutionEvaluator(FakeEmbeddingGenerator())
    problem_embedding = unit_vector([1.0, 0.0, 0.0])

    good_solution = SolutionInput(
        solution_id="s1",
        organization="Good NGO",
        plan_text="Install a new water pump directly addressing the shortage",
        estimated_cost=50000,
        estimated_time_days=30,
        track_record=9,
        expected_profit_percent=5,
    )
    bad_solution = SolutionInput(
        solution_id="s2",
        organization="Expensive Corp",
        plan_text="Unrelated generic consulting services",
        estimated_cost=500000,
        estimated_time_days=365,
        track_record=1,
        expected_profit_percent=40,
    )

    # good_solution's plan closely matches the problem's embedding direction;
    # bad_solution's is orthogonal (unrelated).
    solution_embeddings = [unit_vector([0.95, 0.05, 0.0]), unit_vector([0.0, 1.0, 0.0])]

    ranked = evaluator.score_solutions(
        problem_embedding, [good_solution, bad_solution], solution_embeddings
    )

    assert ranked[0].solution_id == "s1"
    assert ranked[0].final_score > ranked[1].final_score
    assert ranked[1].low_relevance_warning is True
    assert ranked[0].low_relevance_warning is False


def test_single_solution_gets_neutral_relative_scores():
    evaluator = SolutionEvaluator(FakeEmbeddingGenerator())
    problem_embedding = unit_vector([1.0, 0.0])
    solution = SolutionInput(
        solution_id="only",
        organization="Solo Org",
        plan_text="A plan",
        estimated_cost=10000,
        estimated_time_days=10,
        track_record=5,
        expected_profit_percent=10,
    )
    ranked = evaluator.score_solutions(
        problem_embedding, [solution], [unit_vector([1.0, 0.0])]
    )
    assert len(ranked) == 1
    # No other solution to compare against -> cost/time/track/profit all neutral (5.0).
    assert ranked[0].cost_score == 5.0
    assert ranked[0].time_score == 5.0
    assert ranked[0].track_record_score == 5.0
    assert ranked[0].profit_score == 5.0
    # Relevance is still computed in absolute terms (identical vectors here).
    assert ranked[0].relevance_score == 10.0


def test_empty_solutions_returns_empty_list():
    evaluator = SolutionEvaluator(FakeEmbeddingGenerator())
    result = evaluator.score_solutions(unit_vector([1.0, 0.0]), [], [])
    assert result == []


def test_to_dict_shape():
    evaluator = SolutionEvaluator(FakeEmbeddingGenerator())
    problem_embedding = unit_vector([1.0, 0.0])
    solution = SolutionInput(
        solution_id="s1",
        organization="Org",
        plan_text="plan",
        estimated_cost=100,
        estimated_time_days=5,
        track_record=7,
        expected_profit_percent=10,
    )
    ranked = evaluator.score_solutions(
        problem_embedding, [solution], [unit_vector([1.0, 0.0])]
    )
    d = ranked[0].to_dict()
    assert d["solution_id"] == "s1"
    assert set(d["breakdown"].keys()) == {
        "relevance",
        "cost",
        "time",
        "track_record",
        "profit",
    }
