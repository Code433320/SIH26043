# SIH26043 — ML Service

This is the AI/ML brain of the project. It does two jobs:

1. **Understands problems** citizens submit (what category, how urgent, is it a duplicate).
2. **Ranks solutions** that organizations propose for those problems (which one is actually the best deal).

Everything below explains how it works and exactly how to call it from the main backend. No ML background needed to read this.

---

## Quick start (get it running in 5 minutes)

```bash
cd ml-service
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn api:app --reload --port 8000
```

Wait for `Application startup complete`, then open **http://127.0.0.1:8000/docs** in your browser. That's an interactive page where you can test every endpoint without writing any code — click an endpoint, click "Try it out", fill in the boxes, click "Execute".

The first time you run it, it downloads a couple of AI models automatically (needs internet, one-time only, a few hundred MB). After that it works offline.

---

## The big picture: two pipelines

Think of this service as two separate assembly lines:

```
PIPELINE 1 — Problem Analysis
Citizen submits a problem (text/photo/voice-as-text)
        |
        v
   category + priority + duplicate-check + cluster
        |
        v
   saved with a problem_id


PIPELINE 2 — Solution Evaluation
Organization proposes a solution to a problem_id
        |
        v
   scored on relevance + cost + time + track record + profit
        |
        v
   ranked, best solution shown first
```

Pipeline 2 only works on problems that already exist (created by Pipeline 1) — every solution needs a `problem_id` to attach to.

---

## Pipeline 1: Problem Analysis

### What it does, step by step

1. **Cleans the text** (removes junk characters, combines title + description).
2. **Turns text into a "meaning vector"** (called an embedding) using an AI model (Sentence Transformers). Two problems with similar meaning get similar vectors, even if worded completely differently.
3. **Checks for duplicates**: compares the new vector against every previous problem. If very similar (85%+), flags it as a duplicate. If somewhat similar (70%+), flags it as "similar" (not necessarily the same problem).
4. **Picks a category** (Water and Sanitation, Health, Education, Transportation, etc. — 12 total) by comparing the problem's meaning to a description of each category.
5. **Groups similar problems together** (clustering) — so 20 people reporting the same broken road show up as one cluster instead of 20 separate items.
6. **Scores priority** (0-10) from severity, urgency, and how many people are affected.

All of this happens for text, a photo, or both — see "Input types" below.

### Input types

| Input | Endpoint | What happens |
|---|---|---|
| Typed text | `POST /analyze-problem` | Title + description go straight through the pipeline |
| Photo | `POST /analyze-problem/with-image` | AI looks at the photo and writes a caption, plus reads any text written on/in the photo (OCR). Both get combined with any typed text you also send. |
| Voice | *(frontend's job, not this API)* | Convert voice to text in the browser first (e.g. the Web Speech API), then send that text to `/analyze-problem` like normal typed text. This service never needs to know it came from voice. |

### `POST /analyze-problem`

**Request:**
```json
{
    "title": "Water shortage",
    "description": "Villagers do not have clean drinking water.",
    "affected_people": 500,
    "severity": 8,
    "urgency": 9
}
```
`affected_people`, `severity` (0-10), `urgency` (0-10) are all optional — leave them out and the service uses reasonable defaults, but the priority score is more accurate the more you provide.

**Response:**
```json
{
    "problem_id": "3f9a1e2b-...",
    "category": "Water and Sanitation",
    "category_confidence": 0.83,
    "classification_method": "zero_shot",
    "top_categories": [
        {"category": "Water and Sanitation", "confidence": 0.83},
        {"category": "Health", "confidence": 0.09}
    ],
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

**Field-by-field, in plain English:**

| Field | Meaning |
|---|---|
| `problem_id` | Save this — you need it to submit solutions against this problem later |
| `category` | The single best-guess category |
| `category_confidence` | How sure the model is (0-1). Can look low (e.g. 0.2-0.5) even when the guess is right — there are 12 categories to choose between, so this isn't like a simple yes/no confidence |
| `top_categories` | The top 2 guesses, in case the problem genuinely fits more than one category (e.g. "garbage dumped near a school" touches both Environment and Education) |
| `priority_score` | 0-10, higher = more urgent |
| `is_duplicate` | True if this is basically the exact same problem as one already submitted (85%+ match) |
| `is_similar` | True if it's related to a previous problem but not necessarily identical (70%+ match) |
| `duplicate_of` | The `problem_id` it matched, or `null` if nothing matched |
| `cluster_id` | Problems with the same `cluster_id` (and not -1) are grouped as "the same underlying issue reported multiple times". `-1` means it doesn't belong to any cluster yet — normal for a new/unique problem, not an error |

### `POST /analyze-problem/with-image`

Same idea, but as a **file upload** (`multipart/form-data`, not JSON — that matters for how the backend calls it, see the code example further down).

```bash
curl -X POST http://127.0.0.1:8000/analyze-problem/with-image \
  -F "image=@pothole.jpg" \
  -F "title=Pothole near market" \
  -F "affected_people=300" \
  -F "severity=7"
```

Returns everything `/analyze-problem` returns, plus:
- `image_caption` — what the AI thinks the photo shows, in one sentence
- `ocr_text` — any text it found written in the photo (usually empty — that's normal for photos of potholes/garbage/etc.)

**Important tip:** always send at least a short `title` along with the photo if you can. The AI caption alone is sometimes vague or misses the actual problem in a cluttered photo — a short typed title makes categorization noticeably more accurate.

### `POST /analyze-problem/preview`

Identical to `/analyze-problem`, but does **not** save the problem — use this for a live "here's what this would be categorized as" preview while the user is still typing, without cluttering the real dataset.

### `GET /problems`

**History view** — see everything submitted so far.

```
GET /problems?limit=50&offset=0
```

```json
{
    "total": 42,
    "limit": 50,
    "offset": 0,
    "problems": [
        {
            "problem_id": "3f9a1e2b-...",
            "title": "Water shortage",
            "description": "Villagers do not have clean drinking water.",
            "category": "Water and Sanitation",
            "priority_score": 8.6,
            "cluster_id": 0,
            "num_solutions": 2,
            "created_at": "2026-09-14T10:23:00+00:00"
        }
    ]
}
```
Most recent first. `num_solutions` tells you at a glance which problems already have proposals — grab that `problem_id` and use it with `/rank-solutions/{problem_id}` (Pipeline 2, below) to see them.

### `GET /stats`

Just the numbers — total problems, how many clusters formed, breakdown by category. Good for a dashboard widget.

### `GET /health`

Returns `{"status": "ok"}` — for uptime monitors / load balancers.

---

## Pipeline 2: Solution Evaluation

Once a problem exists (has a `problem_id`), any organization — a university, an NGO, a government body — can propose a solution. This pipeline scores every solution proposed for the same problem and ranks them, so a reviewer sees the strongest option first instead of reading every submission top to bottom.

### How the scoring works

Each solution gets a score out of 10, built from 5 factors:

| Factor | What it checks | Weight |
|---|---|---|
| **Relevance** | Does the plan's text actually address *this* problem, or is it generic/copy-pasted? | 25% |
| **Cost** | Lower estimated cost (compared to the other proposals for this same problem) | 20% |
| **Time** | Shorter estimated timeline | 15% |
| **Track record** | More relevant past experience (you provide this as a 0-10 number) | 25% |
| **Profit** | Lower expected profit margin — more of the budget goes to the actual work | 15% |

**Key detail:** cost/time/track-record/profit are scored **relative to the other solutions for the same problem**, not against some fixed universal number. ₹50,000 is expensive for fixing one street light but cheap for rebuilding a bridge — so the "cheapest of this group" always scores highest, whatever the actual numbers are. Relevance is the only factor scored in absolute terms (it's a similarity to the problem itself, not to other solutions).

### `POST /submit-solution`

```json
{
    "problem_id": "3f9a1e2b-...",
    "organization": "City Water Trust NGO",
    "plan_text": "Install a solar-powered water purification and pump system serving 500 households.",
    "estimated_cost": 50000,
    "estimated_time_days": 30,
    "track_record": 8,
    "expected_profit_percent": 5
}
```
- `problem_id` must be a real, already-submitted problem — this fails with a 422 error if it doesn't exist.
- `track_record` (0-10) and `expected_profit_percent` (0-100) are your organization's own judgement calls when you're collecting this data on the frontend — this service just uses whatever numbers it's given.
- **Write a specific `plan_text`.** A vague plan like "we will fix the issue" scores badly on relevance even from a great organization, because the AI can't tell it actually addresses this specific problem.

**Response:** `{"solution_id": "...", "problem_id": "..."}`

### `GET /rank-solutions/{problem_id}`

```json
{
    "problem_id": "3f9a1e2b-...",
    "solutions": [
        {
            "solution_id": "...",
            "organization": "City Water Trust NGO",
            "final_score": 7.8,
            "breakdown": {
                "relevance": 8.5,
                "cost": 9.0,
                "time": 7.0,
                "track_record": 8.0,
                "profit": 6.5
            },
            "relevance_similarity": 0.71,
            "low_relevance_warning": false
        }
    ]
}
```

Best solution is first in the list. `breakdown` shows exactly why each solution scored the way it did — this is explainable by design, not a black box. `low_relevance_warning: true` means the plan doesn't closely match the original problem — worth a human double-check, not an automatic rejection. An empty `solutions` list just means nothing has been submitted for that problem yet (not an error). A `404` means the `problem_id` itself doesn't exist.

---

## Calling this from your backend

### From Node.js / Express (JSON endpoints — problems, solutions)

```js
const axios = require("axios");

app.post("/submit-problem", async (req, res) => {
  try {
    const mlResponse = await axios.post("http://127.0.0.1:8000/analyze-problem", {
      title: req.body.title,
      description: req.body.description,
      affected_people: req.body.affectedPeople,
      severity: req.body.severity,
      urgency: req.body.urgency,
    });

    // Save mlResponse.data (includes problem_id) in your database,
    // then return it to the frontend.
    res.json({ message: "Problem processed", mlResult: mlResponse.data });
  } catch (error) {
    res.status(500).json({ message: "ML service error", error: error.message });
  }
});
```

### From the frontend, for a photo upload

The image endpoint needs `FormData`, **not** a plain JSON body:

```js
const formData = new FormData();
formData.append("image", fileInput.files[0]);
formData.append("title", "Pothole near market");
formData.append("affected_people", "300");

const res = await fetch("http://127.0.0.1:8000/analyze-problem/with-image", {
  method: "POST",
  body: formData,
});
const result = await res.json();
```

### Submitting and ranking solutions

```js
// An organization submits a solution
await axios.post("http://127.0.0.1:8000/submit-solution", {
  problem_id: theProblemId,
  organization: "City Water Trust NGO",
  plan_text: "Install a solar-powered water purification unit...",
  estimated_cost: 50000,
  estimated_time_days: 30,
  track_record: 8,
  expected_profit_percent: 5,
});

// Later, show the reviewer the ranked list
const ranked = await axios.get(`http://127.0.0.1:8000/rank-solutions/${theProblemId}`);
```

---

## Good to know before you connect

- **CORS is wide open** in development (`allow_origins=["*"]`) so your backend or even a browser can call this directly without extra setup. Tighten this before a real production deploy.
- **This service is stateless from your point of view** — it doesn't know about your users, auth, or database. It only knows about problems and solutions it's been given directly through its own endpoints. Your backend owns the source of truth; this service is a specialist it can call.
- **Data persists across restarts** — everything submitted is saved to `models/problem_store.pkl` and `models/solution_store.pkl` on disk, so restarting the API (or `--reload` during development) doesn't lose anything.
- **First request after starting the API can be slow** (models loading into memory) — subsequent requests are much faster. Consider "warming up" the service (send one dummy request) right after it starts, before a live demo.
- **A 422 response** means something about your request was invalid (e.g. missing required field, or a `problem_id` that doesn't exist) — check the `detail` field in the response for the exact reason.

---

## Project structure

```
ml-service/
├── data/
│   └── sample_problems.csv       # labelled sample data for training upgrades (55 rows, all categories)
├── models/                       # trained models + persisted data (gitignored)
├── src/
│   ├── config.py                 # all tunable constants: categories, thresholds, weights
│   ├── preprocessing.py          # text cleaning
│   ├── embeddings.py             # turns text into meaning-vectors (Sentence Transformers)
│   ├── duplicate_detection.py    # compares new problems against past ones
│   ├── classification.py         # picks a category (zero-shot, upgradeable to a trained model)
│   ├── clustering.py             # groups similar problems together (HDBSCAN)
│   ├── priority_model.py         # 0-10 urgency score (heuristic, upgradeable to a trained model)
│   ├── image_processing.py       # AI photo captioning + OCR text extraction
│   ├── solution_evaluation.py    # Pipeline 2: scores and ranks proposed solutions
│   └── pipeline.py               # wires everything above together; this is what api.py calls
├── tests/                        # automated tests (pytest) — 33 tests, run with `pytest`
├── api.py                        # the FastAPI app — every endpoint described above lives here
├── main.py                       # run the pipeline from the terminal without the API (`python main.py`)
└── requirements.txt
```

## Getting more accurate over time

Right now, **classification** and **priority scoring** work with zero training data (see `src/classification.py` and `src/priority_model.py` for how). Once real submissions accumulate and get labelled with the correct category/priority, running:

```bash
python -m src.classification
python -m src.priority_model
```

trains a proper model on that data and the API automatically switches to using it — no code changes needed. `data/sample_problems.csv` has 55 example rows to try this with right away.

## Running tests

```bash
pytest
```
Should show all tests passing. Most run offline in a few seconds (they use fake data, not the real AI models) — a couple that touch the image pipeline take longer the first time while heavier libraries load.
