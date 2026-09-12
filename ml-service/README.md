# Societal Challenge ML Service

A standalone Python ML service for the SIH26043 Societal Challenge Platform.
It receives a submitted problem (title + description + optional impact
numbers) from the main backend and returns category, priority score,
duplicate/similarity info, and cluster id — everything the platform needs to
triage submissions automatically.

## Architecture

```
Frontend -> Main backend -> ML service (this repo) -> Main backend -> Frontend
```

The ML service never talks to the frontend or a database directly. It is
stateless from the backend's point of view: send problem text in, get
analysis back. (Internally it does keep a small persisted store of past
problems for duplicate detection and clustering — see "How state works"
below — but that's an implementation detail the backend doesn't need to know
about.)

## Pipeline

```
title + description
        |
        v
  preprocessing.py      -> cleans and combines text
        |
        v
  embeddings.py          -> 384-dim Sentence Transformer vector (all-MiniLM-L6-v2)
        |
        +--> duplicate_detection.py  -> cosine similarity vs. past problems
        +--> classification.py       -> category (zero-shot, upgradeable to trained)
        +--> clustering.py           -> HDBSCAN cluster id
        +--> priority_model.py       -> 0-10 priority score
        |
        v
  pipeline.py combines all of the above into one result
```

### Why classification and priority scoring "just work" with no training data

At this stage of the project there's no large labelled dataset yet, so both
`classification.py` and `priority_model.py` ship with a working default that
needs zero training:

- **Classification** compares a problem's embedding to a short description
  of each category (see `CATEGORY_DESCRIPTIONS` in `src/config.py`) and
  picks the closest one. This is "zero-shot" classification — it works
  immediately and reasonably well because Sentence Transformers already
  understand semantic meaning.
- **Priority scoring** uses a transparent weighted formula over severity,
  urgency, and affected people (log-scaled, since impact doesn't grow
  linearly with headcount).

Once `data/sample_problems.csv` has enough labelled rows (a `category`
column, and/or `priority_score` + the three numeric fields), run:

```bash
python -m src.classification    # trains and saves a classifier if enough labelled data
python -m src.priority_model     # trains and saves an XGBoost regressor if enough labelled data
```

The API automatically prefers the trained model over the heuristic/zero-shot
default whenever `models/classifier_model.joblib` or
`models/priority_model.joblib` exists — no code changes needed. A sample
labelled CSV (55 rows across all 12 categories) is included in
`data/sample_problems.csv` so you can try this immediately; add more real
submissions as they come in to improve accuracy further.

### How state works

`duplicate_detection.py` and `clustering.py` need to compare a new problem
against previously submitted ones. The pipeline keeps these in memory and
persists them to `models/problem_store.pkl` after every `/analyze-problem`
call, so restarting the service (or a `--reload` during development) doesn't
lose the dataset. In production, once the main backend has its own database
of problems, you can swap this for a call that loads embeddings from that
database at startup instead — the rest of the pipeline doesn't change.

## Setup

```bash
cd ml-service
python -m venv venv

# Windows PowerShell
venv\Scripts\activate

pip install -r requirements.txt
```

The Sentence Transformer model downloads automatically the first time it's
used, then lives in your local model cache.

## Running the API

```bash
uvicorn api:app --reload --port 8000
```

- Service: http://127.0.0.1:8000
- Swagger docs: http://127.0.0.1:8000/docs

## Running local tests (no API needed)

```bash
python main.py          # runs the full pipeline on a few sample problems
pytest                   # runs the automated test suite
```

Most tests run fully offline (they use synthetic embeddings, not the real
model) so they're fast and don't need model downloads. `main.py` and the API
do need the real Sentence Transformer model.

## API Reference

### `POST /analyze-problem` — the main endpoint

Request:
```json
{
    "title": "Water shortage",
    "description": "Villagers do not have clean drinking water.",
    "affected_people": 500,
    "severity": 8,
    "urgency": 9
}
```

`affected_people`, `severity` (0-10), and `urgency` (0-10) are all optional —
omit them and the priority model uses sensible defaults.

Response:
```json
{
    "problem_id": "3f9a1e2b-...",
    "category": "Water and Sanitation",
    "category_confidence": 0.83,
    "classification_method": "zero_shot",
    "priority_score": 8.6,
    "priority_method": "heuristic",
    "is_duplicate": false,
    "is_similar": false,
    "duplicate_of": null,
    "similarity_score": 0.0,
    "cluster_id": -1,
    "clustering_algorithm": "hdbscan",
    "embedding_size": 384
}
```

`cluster_id: -1` means "not part of any cluster yet" (HDBSCAN calls this
noise) — expected until there are a few similar problems in the dataset.

### `POST /analyze-problem/preview`

Same request/response shape, but does not save the problem — useful for a
live "here's what this would be categorized as" preview in the frontend
without polluting the duplicate-detection/clustering dataset.

### `POST /generate-embedding`

The original tested endpoint, kept for backward compatibility. Returns the
raw 384-dim embedding for a title + description.

### `GET /stats`

Summary of everything analyzed so far — total problems, cluster/category
counts. Useful for an admin dashboard.

### `GET /health`

Simple liveness check for load balancers / uptime monitors.

## Example: calling this from a Node.js/Express backend

```js
const axios = require("axios");

app.post("/submit-problem", async (req, res) => {
  try {
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/analyze-problem",
      {
        title: req.body.title,
        description: req.body.description,
        affected_people: req.body.affectedPeople,
        severity: req.body.severity,
        urgency: req.body.urgency,
      }
    );

    // Save mlResponse.data alongside the problem in your database, then
    // return it to the frontend.
    res.json({ message: "Problem processed successfully", mlResult: mlResponse.data });
  } catch (error) {
    res.status(500).json({ message: "ML service error", error: error.message });
  }
});
```

## Project structure

```
ml-service/
├── data/
│   └── sample_problems.csv       # labelled sample data (55 rows, all categories)
├── models/                       # trained models + problem_store.pkl (gitignored)
├── notebooks/                    # experiments
├── src/
│   ├── config.py                 # categories, thresholds, weights - tune here
│   ├── preprocessing.py          # text cleaning
│   ├── embeddings.py             # Sentence Transformer wrapper (singleton)
│   ├── duplicate_detection.py    # cosine similarity vs. past problems
│   ├── classification.py         # zero-shot + trainable category classifier
│   ├── clustering.py             # HDBSCAN (DBSCAN fallback)
│   ├── priority_model.py         # heuristic + trainable XGBoost priority score
│   └── pipeline.py               # orchestrates everything, persists state
├── tests/                        # pytest suite (mostly offline-friendly)
├── api.py                        # FastAPI app
├── main.py                       # local terminal test runner
├── conftest.py                   # makes `from src.x import y` work in tests
└── requirements.txt
```

## Working rules (carried over from project notes)

- Don't replace an entire file unnecessarily — edit only the section you need to change.
- Keep each module responsible for one thing (`embeddings.py` only does embeddings, etc.).
- Test a module (`pytest tests/test_<module>.py`) before wiring it into the pipeline.
- Keep `requirements.txt` updated whenever a new dependency is added.
- Keep the ML service independent from the main backend — no auth, no DB, no business logic here.
- A `422` in Swagger is a documented possible response, not an error, unless an actual request returns it.

## Project status

**Completed and tested:**
- Repository + ML service folder structure
- Sentence Transformer embeddings (`all-MiniLM-L6-v2`, 384-dim)
- Preprocessing, duplicate detection, zero-shot classification, HDBSCAN clustering, heuristic priority scoring
- Full `/analyze-problem` pipeline endpoint with persisted state
- Trainable classifier / priority model upgrade path (`python -m src.classification`, `python -m src.priority_model`)
- Automated test suite (pytest)

**Planned:**
- Swap heuristic/zero-shot defaults for trained models once real submission
  data accumulates
- Persisted state backed by the main backend's database instead of a local
  pickle file
- Production deployment (containerize + replace `127.0.0.1` with the
  deployed service URL)
