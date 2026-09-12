"""
main.py

Local testing of the ML pipeline from the terminal, without needing the API
running. Run with:

    python main.py

By default this reuses whatever is in models/problem_store.pkl, so running
it twice in a row will correctly show the second run's problems as
duplicates of the first (the store persists across runs, same as it would
across API restarts). To start from a clean slate instead, run:

    python main.py --fresh
"""

import argparse

from src.pipeline import get_pipeline, reset_store


def main():
    parser = argparse.ArgumentParser(description="Run the ML pipeline on sample problems.")
    parser.add_argument(
        "--fresh",
        action="store_true",
        help="Clear the persisted problem store before running, so this run "
        "starts with an empty dataset instead of reusing problems from a "
        "previous run.",
    )
    args = parser.parse_args()

    if args.fresh:
        reset_store()
        print("Cleared previous problem store -- starting fresh.\n")

    pipeline = get_pipeline()

    sample_problems = [
        {
            "title": "Water Storage",
            "description": "Villagers do not have access to clean drinking water.",
            "affected_people": 500,
            "severity": 8,
            "urgency": 9,
        },
        {
            "title": "Water shortage in village",
            "description": "Rural communities do not have safe drinking water facilities.",
            "affected_people": 450,
            "severity": 7,
            "urgency": 8,
        },
        {
            "title": "Broken road near school",
            "description": "The main road leading to the school has large potholes "
            "and is dangerous for children walking to class.",
            "affected_people": 200,
            "severity": 5,
            "urgency": 6,
        },
    ]

    for problem in sample_problems:
        print("=" * 60)
        print(f"Problem: {problem['title']}")
        result = pipeline.analyze(**problem)
        for key, value in result.to_dict().items():
            print(f"  {key}: {value}")

    print("=" * 60)
    print("Pipeline stats:", pipeline.stats())


if __name__ == "__main__":
    main()
