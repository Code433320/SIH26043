"""
preprocessing.py

Text cleaning and preparation functions. Kept deliberately light -- Sentence
Transformers are trained on natural language and are robust to casing and
punctuation, so we avoid aggressive cleaning (like stripping stopwords or
stemming) that would actually *hurt* embedding quality. We mainly guard
against messy/empty input from the frontend.
"""

import re

_WHITESPACE_RE = re.compile(r"\s+")
_ALLOWED_CHARS_RE = re.compile(r"[^a-zA-Z0-9\s.,!?;:'\"()\-]")


def clean_text(text: str) -> str:
    """
    Cleans a single piece of text:
    - Strips leading/trailing whitespace.
    - Collapses repeated whitespace/newlines into a single space.
    - Removes control characters and stray symbols that sometimes come
      through from copy-pasted frontend input, while keeping normal
      punctuation intact (it carries meaning for the sentence transformer).

    Does NOT lowercase or remove stopwords -- Sentence Transformers use
    the original casing/context, and destroying it lowers embedding quality.
    """
    if text is None:
        return ""

    text = str(text).strip()
    if not text:
        return ""

    # Remove characters that are neither alphanumeric nor common punctuation.
    text = _ALLOWED_CHARS_RE.sub(" ", text)

    # Collapse whitespace.
    text = _WHITESPACE_RE.sub(" ", text).strip()

    return text


def prepare_problem_text(title: str, description: str) -> str:
    """
    Combines a problem's title and description into the single string that
    gets embedded. Keeping this in one place means every module (API,
    training scripts, notebooks) produces embeddings the same way -- which
    matters a lot, since embeddings of differently-formatted text are not
    directly comparable.
    """
    clean_title = clean_text(title)
    clean_description = clean_text(description)

    if clean_title and clean_description:
        return f"{clean_title}. {clean_description}"
    return clean_title or clean_description


def validate_problem_text(title: str, description: str) -> None:
    """
    Raises ValueError with a clear message if the problem text is unusable.
    Intended to be called by the API layer before doing any ML work, so
    bad input fails fast with a helpful message rather than a confusing
    downstream error.
    """
    if not clean_text(title) and not clean_text(description):
        raise ValueError("Both 'title' and 'description' are empty after cleaning.")
