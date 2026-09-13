import pytest

from src.preprocessing import clean_text, prepare_problem_text, validate_problem_text


def test_clean_text_strips_whitespace():
    assert clean_text("  hello   world  ") == "hello world"


def test_clean_text_handles_none():
    assert clean_text(None) == ""


def test_clean_text_removes_control_chars_keeps_punctuation():
    assert clean_text("Water!! shortage??") == "Water!! shortage??"


def test_prepare_problem_text_combines_title_and_description():
    result = prepare_problem_text("Water Storage", "No clean water access.")
    assert result == "Water Storage. No clean water access."


def test_prepare_problem_text_handles_missing_description():
    result = prepare_problem_text("Water Storage", "")
    assert result == "Water Storage"


def test_validate_problem_text_raises_on_empty():
    with pytest.raises(ValueError):
        validate_problem_text("", "")


def test_validate_problem_text_passes_with_content():
    validate_problem_text("Title", "")  # should not raise
