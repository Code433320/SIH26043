import re


class ProblemClassifier:
    """
    Classifies societal problems into broad categories.
    This is a baseline classifier for the first working version.
    """

    CATEGORY_KEYWORDS = {
        "Water": [
            "water",
            "drinking",
            "irrigation",
            "river",
            "drought",
            "shortage"
        ],
        "Healthcare": [
            "health",
            "hospital",
            "doctor",
            "medicine",
            "medical",
            "disease",
            "healthcare"
        ],
        "Education": [
            "school",
            "student",
            "education",
            "teacher",
            "learning",
            "college",
            "library"
        ],
        "Waste": [
            "waste",
            "garbage",
            "plastic",
            "recycling",
            "sanitation",
            "collection"
        ],
        "Agriculture": [
            "farmer",
            "crop",
            "agriculture",
            "fertilizer",
            "soil",
            "farming"
        ],
        "Environment": [
            "pollution",
            "environment",
            "forest",
            "climate",
            "air",
            "emission"
        ],
        "Transport": [
            "road",
            "traffic",
            "transport",
            "bus",
            "vehicle",
            "accident"
        ]
    }

    def predict_category(self, text: str) -> str:

        text = text.lower()

        category_scores = {}

        for category, keywords in self.CATEGORY_KEYWORDS.items():

            score = 0

            for keyword in keywords:
                if re.search(r"\b" + keyword + r"\b", text):
                    score += 1

            category_scores[category] = score

        best_category = max(
            category_scores,
            key=category_scores.get
        )

        if category_scores[best_category] == 0:
            return "Other"

        return best_category

    def predict_categories(self, texts: list[str]) -> list[str]:
        return [
            self.predict_category(text)
            for text in texts
        ]