import fitz  # PDF
import docx2txt  # For DOCX
from PIL import Image  # For OCR on images
import pytesseract  # OCR Engine

# 🔧 Set the path to Tesseract executable (only on Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text(file_path: str) -> str:
    extension = file_path.split(".")[-1].lower()

    if extension == "pdf":
        doc = fitz.open(file_path)
        return "\n".join(page.get_text() for page in doc)

    elif extension == "docx":
        return docx2txt.process(file_path)

    elif extension in ["jpg", "jpeg", "png"]:
        image = Image.open(file_path)
        return pytesseract.image_to_string(image)

    else:
        return "Unsupported file type"
