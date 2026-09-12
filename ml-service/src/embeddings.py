"""
embeddings.py

Generates semantic embeddings using Sentence Transformers. This is the
tested, working module from the project -- kept as-is, with the model load
wrapped so import time stays fast (the model only loads when actually used)
and so other modules can share one instance instead of loading it twice.
"""

from functools import lru_cache

import numpy as np
from sentence_transformers import SentenceTransformer


class EmbeddingGenerator:
    """
    Generates semantic embeddings using Sentence Transformers.
    """

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        print("Loading Sentence Transformer model...")

        self.model = SentenceTransformer(model_name)
        # get_embedding_dimension() is the current method name; older
        # sentence-transformers versions only have the deprecated
        # get_sentence_embedding_dimension(), so fall back to it.
        if hasattr(self.model, "get_embedding_dimension"):
            self.embedding_dim = self.model.get_embedding_dimension()
        else:
            self.embedding_dim = self.model.get_sentence_embedding_dimension()

        print("Embedding model loaded successfully!")

    def generate_embedding(self, text: str) -> np.ndarray:
        """
        Converts one text into a semantic embedding.
        """

        embedding = self.model.encode(
            text,
            convert_to_numpy=True,
            normalize_embeddings=True,
        )

        return embedding

    def generate_embeddings(self, texts: list) -> np.ndarray:
        """
        Converts multiple texts into embeddings.
        """

        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=len(texts) > 20,
        )

        return embeddings


@lru_cache(maxsize=1)
def get_embedding_generator(model_name: str = "all-MiniLM-L6-v2") -> EmbeddingGenerator:
    """
    Returns a process-wide singleton EmbeddingGenerator.

    Loading a Sentence Transformer takes a couple of seconds and holds it in
    memory (~90MB for all-MiniLM-L6-v2). Every module in this pipeline needs
    embeddings, so instead of each one loading its own copy of the model,
    they all call this function and share one instance. This is what
    pipeline.py and api.py use.
    """
    return EmbeddingGenerator(model_name)
