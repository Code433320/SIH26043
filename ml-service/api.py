"""
api.py

Exposes the ML pipeline through FastAPI so the main backend can call it over
HTTP. Kept deliberately "dumb": no auth, no DB, no business logic -- that all
belongs in the main backend (see README.md, "Architecture"). This service
takes problem text + numeric signals in, and returns ML analysis out.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.embeddings import get_embedding_generator
from src.pipeline import get_pipeline

app = FastAPI(
    title="Societal Challenge ML Service",
    description="AI service for societal problem analysis: embeddings, "
    "duplicate detection, classification, clustering, and priority scoring.",
    version="2.0",
)

# Wide-open CORS so the main backend (running on a different host/port, or
# a browser calling it directly during development) can reach this service
# without extra config. Tighten allow_origins for a production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request / response models
# ---------------------------------------------------------------------------
class ProblemRequest(BaseModel):
    title: str = Field(..., min_length=1, examples=["Water Storage"])
    description: str = Field(
        ..., min_length=1, examples=["Villagers do not have access to clean drinking water."]
    )


class AnalyzeProblemRequest(BaseModel):
    title: str = Field(..., min_length=1, examples=["Water shortage"])
    description: str = Field(
        ..., min_length=1, examples=["Villagers do not have clean drinking water."]
    )
    affected_people: int | None = Field(default=None, ge=0, examples=[500])
    severity: float | None = Field(default=None, ge=0, le=10, examples=[8])
    urgency: float | None = Field(default=None, ge=0, le=10, examples=[9])


# ---------------------------------------------------------------------------
# Startup: load models once, not per-request
# ---------------------------------------------------------------------------
@app.on_event("startup")
def load_models() -> None:
    # Triggers the Sentence Transformer load and pipeline construction (which
    # itself loads the classifier/priority/cluster components) at startup
    # instead of on the first request, so the first real user isn't the one
    # who waits for model loading.
    get_embedding_generator()
    get_pipeline()


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/")
def home():
    return {"message": "Societal Challenge ML Service is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/generate-embedding")
def generate_embedding(problem: ProblemRequest):
    """Kept for backward compatibility with the original tested endpoint."""
    embedding_generator = get_embedding_generator()
    text = f"{problem.title}. {problem.description}"
    embedding = embedding_generator.generate_embedding(text)

    return {
        "title": problem.title,
        "embedding": embedding.tolist(),
        "embedding_size": len(embedding),
    }


@app.post("/analyze-problem")
def analyze_problem(request: AnalyzeProblemRequest):
    """
    The main endpoint: takes a full problem submission and returns
    category, priority score, duplicate/similarity info, and cluster id in
    one call. This is what the main backend should use in production.
    """
    pipeline = get_pipeline()
    try:
        result = pipeline.analyze(
            title=request.title,
            description=request.description,
            affected_people=request.affected_people,
            severity=request.severity,
            urgency=request.urgency,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return result.to_dict()


@app.post("/analyze-problem/preview")
def analyze_problem_preview(request: AnalyzeProblemRequest):
    """
    Same as /analyze-problem, but does NOT save the problem into the
    dataset used for future duplicate detection / clustering. Useful for a
    frontend that wants to show a live preview as the user types, without
    polluting the dataset with every keystroke-triggered call.
    """
    pipeline = get_pipeline()
    try:
        result = pipeline.analyze(
            title=request.title,
            description=request.description,
            affected_people=request.affected_people,
            severity=request.severity,
            urgency=request.urgency,
            store_result=False,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return result.to_dict()


@app.get("/stats")
def stats():
    """Summary of everything analyzed so far -- handy for an admin dashboard."""
    return get_pipeline().stats()
