"""
config.py

Central place for constants shared across the ML pipeline. Keeping these
here (instead of scattered magic numbers in every module) means a teammate
tuning the system only has to look in one file.
"""

# ---------------------------------------------------------------------------
# Categories
# ---------------------------------------------------------------------------
# Each category has a short human-readable description used for zero-shot
# classification (see src/classification.py). The description matters more
# than the label -- it is embedded and compared against incoming problems,
# so make it descriptive and example-rich if you add a new category.
CATEGORY_DESCRIPTIONS = {
    "Water and Sanitation": (
        "Problems about drinking water shortage, water quality, water supply, "
        "sewage, sanitation, toilets, hygiene, and access to clean water."
    ),
    "Health": (
        "Problems about hospitals, healthcare access, diseases, medical "
        "facilities, doctors, medicine shortage, nutrition, and public health."
    ),
    "Education": (
        "Problems about schools, colleges, teachers, literacy, lack of "
        "educational infrastructure, dropout rates, and access to education."
    ),
    "Transportation": (
        "Problems about roads, public transport, traffic, bridges, "
        "connectivity, vehicles, and transportation infrastructure."
    ),
    "Electricity and Energy": (
        "Problems about power outages, electricity supply, energy access, "
        "street lighting, and renewable energy infrastructure."
    ),
    "Agriculture": (
        "Problems about farming, crops, irrigation, farmers, soil quality, "
        "agricultural equipment, and food production."
    ),
    "Environment": (
        "Problems about pollution, deforestation, waste management, "
        "climate, air quality, and environmental degradation."
    ),
    "Infrastructure": (
        "Problems about buildings, construction, public facilities, "
        "housing infrastructure, and civic amenities not covered elsewhere."
    ),
    "Public Safety": (
        "Problems about crime, safety, law enforcement, disaster response, "
        "fire safety, and emergency services."
    ),
    "Housing": (
        "Problems about homelessness, affordable housing, slum conditions, "
        "and shelter access."
    ),
    "Employment": (
        "Problems about unemployment, job opportunities, skill training, "
        "wages, and livelihood."
    ),
    "Other": (
        "General societal problems that do not clearly fit any specific "
        "category."
    ),
}

CATEGORY_LABELS = list(CATEGORY_DESCRIPTIONS.keys())

# ---------------------------------------------------------------------------
# Duplicate detection
# ---------------------------------------------------------------------------
# Cosine similarity above this value => flagged as a duplicate.
DUPLICATE_SIMILARITY_THRESHOLD = 0.85

# Cosine similarity above this (but below the duplicate threshold) => flagged
# as "similar", useful for a "you might also be interested in" style feature.
SIMILAR_THRESHOLD = 0.70

# ---------------------------------------------------------------------------
# Clustering
# ---------------------------------------------------------------------------
HDBSCAN_MIN_CLUSTER_SIZE = 3
HDBSCAN_MIN_SAMPLES = 2

# ---------------------------------------------------------------------------
# Priority scoring (heuristic fallback, used when no trained model exists)
# ---------------------------------------------------------------------------
# Weights must sum to 1.0. Tune these based on domain judgement or, once you
# have labelled data, let priority_model.py train an XGBoost model instead.
PRIORITY_WEIGHTS = {
    "severity": 0.4,
    "urgency": 0.35,
    "affected_people": 0.25,
}

# Everything is scaled to a 0-10 priority score.
PRIORITY_SCORE_MIN = 0.0
PRIORITY_SCORE_MAX = 10.0

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
MODELS_DIR = "models"
PROBLEM_STORE_PATH = f"{MODELS_DIR}/problem_store.pkl"
PRIORITY_MODEL_PATH = f"{MODELS_DIR}/priority_model.joblib"
CLASSIFIER_MODEL_PATH = f"{MODELS_DIR}/classifier_model.joblib"
