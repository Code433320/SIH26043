from src.priority_model import PriorityModel


def test_high_severity_urgency_affected_gives_high_score(tmp_path, monkeypatch):
    # Ensure no trained model file interferes with this test.
    monkeypatch.setattr(
        "src.priority_model.PRIORITY_MODEL_PATH", str(tmp_path / "does_not_exist.joblib")
    )
    model = PriorityModel()
    result = model.predict(affected_people=5000, severity=10, urgency=10)
    assert result.method == "heuristic"
    assert result.priority_score > 7.0


def test_low_severity_urgency_affected_gives_low_score(tmp_path, monkeypatch):
    monkeypatch.setattr(
        "src.priority_model.PRIORITY_MODEL_PATH", str(tmp_path / "does_not_exist.joblib")
    )
    model = PriorityModel()
    result = model.predict(affected_people=1, severity=1, urgency=1)
    assert result.priority_score < 3.0


def test_score_bounded_between_0_and_10(tmp_path, monkeypatch):
    monkeypatch.setattr(
        "src.priority_model.PRIORITY_MODEL_PATH", str(tmp_path / "does_not_exist.joblib")
    )
    model = PriorityModel()
    result = model.predict(affected_people=10**9, severity=10, urgency=10)
    assert 0.0 <= result.priority_score <= 10.0


def test_missing_fields_default_gracefully(tmp_path, monkeypatch):
    monkeypatch.setattr(
        "src.priority_model.PRIORITY_MODEL_PATH", str(tmp_path / "does_not_exist.joblib")
    )
    model = PriorityModel()
    result = model.predict(affected_people=None, severity=None, urgency=None)
    assert 0.0 <= result.priority_score <= 10.0
