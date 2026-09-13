"""
image_processing.py

Turns an uploaded photo into text, so it can flow through the exact same
pipeline as a typed problem (embeddings, classification, clustering, and
priority scoring all expect text). Converting every input type to text
first, then reusing one pipeline, is the same pattern used for voice input
(see ML_PIPELINE_SAMJHO.md) -- it means we never need a second, separate
ML pipeline per input type.

Two independent things happen to an image:

1. Captioning (BLIP model): "what is in this photo" -> a one-sentence
   description, e.g. "a road with a large pothole filled with water".
   This is an AI's best guess just from LOOKING at the picture -- useful
   even when the photo has no text in it at all, which is the common case
   for civic problem photos (potholes, garbage, broken pipes...).
2. OCR (Tesseract via pytesseract): reads any actual TEXT written on/in
   the photo -- a sign, a notice board, a handwritten note held up by the
   person taking the photo. Most photos won't have any, so an empty
   result here is expected, not a bug.

Both are combined with whatever title/description text the user also
typed (if any) into one string that preprocessing.py and the rest of the
pipeline handle exactly like normal typed input.
"""

import io
from dataclasses import dataclass
from functools import lru_cache

from PIL import Image

from src.config import IMAGE_CAPTION_MODEL


@dataclass
class ImageAnalysisResult:
    caption: str
    ocr_text: str
    combined_text: str


class ImageProcessor:
    def __init__(self, caption_model_name: str = IMAGE_CAPTION_MODEL):
        self._caption_model_name = caption_model_name
        self._blip_processor = None
        self._blip_model = None
        self._tesseract_available = self._check_tesseract()

        if not self._tesseract_available:
            print(
                "Tesseract OCR not found on this system -- image captioning "
                "will still work, but text written inside photos won't be "
                "extracted. See README.md 'Image support setup' to enable it."
            )

    # ------------------------------------------------------------------
    # Lazy loading: BLIP is a large model (~1GB). We only load it the
    # first time an image actually needs captioning, not at import time
    # or pipeline startup, so text-only requests never pay this cost.
    # ------------------------------------------------------------------
    def _ensure_blip_loaded(self) -> None:
        if self._blip_model is not None:
            return
        from transformers import BlipForConditionalGeneration, BlipProcessor

        print(f"Loading image captioning model ({self._caption_model_name})...")
        self._blip_processor = BlipProcessor.from_pretrained(self._caption_model_name)
        self._blip_model = BlipForConditionalGeneration.from_pretrained(
            self._caption_model_name
        )
        print("Image captioning model loaded successfully!")

    @staticmethod
    def _check_tesseract() -> bool:
        try:
            import pytesseract

            pytesseract.get_tesseract_version()
            return True
        except Exception:
            return False

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def caption_image(self, image: Image.Image) -> str:
        """Returns a one-sentence AI-generated description of the photo."""
        try:
            self._ensure_blip_loaded()
            inputs = self._blip_processor(image, return_tensors="pt")
            output = self._blip_model.generate(**inputs, max_new_tokens=40)
            caption = self._blip_processor.decode(output[0], skip_special_tokens=True)
            return caption.strip()
        except Exception as exc:  # noqa: BLE001 - captioning failure shouldn't crash analysis
            print(f"Image captioning failed ({exc}); continuing without a caption.")
            return ""

    def extract_text(self, image: Image.Image) -> str:
        """Returns any text found written in the photo (OCR). Empty if none found."""
        if not self._tesseract_available:
            return ""
        try:
            import pytesseract

            text = pytesseract.image_to_string(image)
            return text.strip()
        except Exception as exc:  # noqa: BLE001 - OCR failure shouldn't crash analysis
            print(f"OCR failed ({exc}); continuing without extracted text.")
            return ""

    def process_image_bytes(
        self, image_bytes: bytes, title: str = "", description: str = ""
    ) -> ImageAnalysisResult:
        """
        Runs captioning + OCR on raw image bytes (as received from an
        upload), and combines both results with the user's typed
        title/description into one text string ready for the rest of the
        pipeline.
        """
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        caption = self.caption_image(image)
        ocr_text = self.extract_text(image)

        parts = [p for p in [title.strip(), description.strip(), caption, ocr_text] if p]
        combined_text = ". ".join(parts)

        return ImageAnalysisResult(
            caption=caption, ocr_text=ocr_text, combined_text=combined_text
        )


@lru_cache(maxsize=1)
def get_image_processor() -> ImageProcessor:
    """Process-wide singleton, same pattern as get_embedding_generator()."""
    return ImageProcessor()
