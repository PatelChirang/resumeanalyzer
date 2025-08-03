import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from backend import resume_parser, gemini_engine

app = FastAPI()

FRONTEND_URLS = [
    "https://PatelChirang.github.io",  # GitHub Pages frontend
    # add other deployed frontends here, e.g., Netlify/Vercel domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_URLS + ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {"pdf", "docx", "jpg", "jpeg", "png"}

@app.post("/analyze-resume/")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    ext = file.filename.split(".")[-1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        return {
            "status": "error",
            "message": f"Unsupported file type: .{ext}. Please upload PDF, DOCX, or image (JPG/PNG) files."
        }

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"[INFO] File uploaded: {file.filename} ({ext})")

    try:
        resume_text = resume_parser.extract_text(file_path)
        analysis_result = gemini_engine.analyze_resume_with_job(
            resume_text=resume_text,
            job_description=job_description
        )

        return {
            "status": "success",
            "filename": file.filename,
            "file_type": ext,
            "analysis": analysis_result
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
