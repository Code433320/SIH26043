"""
api.py

Exposes the ML pipeline through FastAPI so the main backend can call it over
HTTP. Kept deliberately "dumb": no auth, no DB, no business logic -- that all
belongs in the main backend (see README.md, "Architecture"). This service
takes problem text + numeric signals in, and returns ML analysis out.
"""

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.config import MAX_IMAGE_SIZE_BYTES
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


class SubmitSolutionRequest(BaseModel):
    problem_id: str = Field(..., examples=["3f9a1e2b-..."])
    organization: str = Field(..., min_length=1, examples=["City Water Trust NGO"])
    plan_text: str = Field(
        ..., min_length=1, examples=["Install a solar-powered water purification unit..."]
    )
    estimated_cost: float = Field(..., ge=0, examples=[50000])
    estimated_time_days: float = Field(..., ge=0, examples=[30])
    track_record: float = Field(
        default=5.0, ge=0, le=10, examples=[8],
        description="0-10: how much relevant past experience this organization has.",
    )
    expected_profit_percent: float = Field(
        default=0.0, ge=0, le=100, examples=[5],
        description="Expected profit margin as a percentage of estimated_cost.",
    )


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


@app.post("/analyze-problem/with-image")
async def analyze_problem_with_image(
    image: UploadFile = File(...),
    title: str = Form(default=""),
    description: str = Form(default=""),
    affected_people: int | None = Form(default=None),
    severity: float | None = Form(default=None),
    urgency: float | None = Form(default=None),
):
    """
    Same result shape as /analyze-problem, plus 'image_caption' (an
    AI-generated one-line description of the photo) and 'ocr_text' (any
    text found written in the photo, often empty -- that's expected).

    title/description are optional here -- if the user only uploads a
    photo with no typed text, the AI caption + any OCR'd text become the
    problem text on their own. multipart/form-data is used instead of
    JSON because file uploads need it; the main backend should call this
    with a FormData request, not axios's default JSON body.
    """
    if image.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported image type '{image.content_type}'. "
            "Use JPEG, PNG, or WEBP.",
        )

    image_bytes = await image.read()
    if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Image too large. Max size is {MAX_IMAGE_SIZE_BYTES // (1024 * 1024)}MB.",
        )

    pipeline = get_pipeline()
    try:
        result = pipeline.analyze_with_image(
            image_bytes=image_bytes,
            title=title,
            description=description,
            affected_people=affected_people,
            severity=severity,
            urgency=urgency,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return result.to_dict()


@app.post("/submit-solution")
def submit_solution(request: SubmitSolutionRequest):
    """
    Pipeline 2, step 1: an organization (university/govt body/NGO)
    proposes a solution to an existing problem. Call /rank-solutions
    afterward to see it scored against any other proposals for the same
    problem_id.
    """
    pipeline = get_pipeline()
    try:
        solution_id = pipeline.submit_solution(
            problem_id=request.problem_id,
            organization=request.organization,
            plan_text=request.plan_text,
            estimated_cost=request.estimated_cost,
            estimated_time_days=request.estimated_time_days,
            track_record=request.track_record,
            expected_profit_percent=request.expected_profit_percent,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return {"solution_id": solution_id, "problem_id": request.problem_id}


@app.get("/rank-solutions/{problem_id}")
def rank_solutions(problem_id: str):
    """
    Pipeline 2, step 2: returns every solution submitted for this
    problem, scored and ranked best-first, so a reviewer sees the
    strongest proposal at the top instead of reading every submission in
    order. Each result includes a breakdown (relevance, cost, time,
    track_record, profit) so the ranking is explainable, not a black box.
    An empty list means the problem has no solutions submitted yet.
    """
    pipeline = get_pipeline()
    try:
        ranked = pipeline.rank_solutions(problem_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return {"problem_id": problem_id, "solutions": [r.to_dict() for r in ranked]}


@app.get("/problems")
def list_problems(limit: int = 50, offset: int = 0):
    """
    History view: returns previously submitted problems, most recent
    first, paginated. Each entry includes num_solutions so you can see
    at a glance which problems already have proposals -- use that
    problem_id with /rank-solutions/{problem_id} to see them ranked.
    """
    pipeline = get_pipeline()
    return pipeline.list_problems(limit=limit, offset=offset)


@app.get("/stats")
def stats():
    """Summary of everything analyzed so far -- handy for an admin dashboard."""
    return get_pipeline().stats()
