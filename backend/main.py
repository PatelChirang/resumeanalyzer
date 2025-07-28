# main.py

import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from backend import resume_parser, gemini_engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"[INFO] File uploaded: {file.filename} ({ext})")

    try:
        # Extract resume text
        resume_text = resume_parser.extract_text(file_path)

        # Analyze resume with job description
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
        # Optional: cleanup uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)
