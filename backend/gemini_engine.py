import os
import requests
from dotenv import load_dotenv

load_dotenv()
SmasherGEM = os.getenv("SmasherGEM")

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
HEADERS = {"Content-Type": "application/json"}


def get_job_suggestions(resume_text: str) -> dict:
    prompt = f"""
You are a career coach. Based on the resume text below, suggest 5 job roles from LinkedIn that match this candidate. 
For each job, include:
1. Job Title
2. Company Type / Industry
3. Expected Salary Range (INR)
4. Reason for Match

Resume:
{resume_text[:4000]}
"""

    body = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    try:
        response = requests.post(
            GEMINI_API_URL,
            headers=HEADERS,
            params={"key": SmasherGEM},
            json=body,
            timeout=20
        )
        result = response.json()

        suggestion_text = result['candidates'][0]['content']['parts'][0]['text']
        return {
            "status": "success",
            "suggestions": suggestion_text
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "raw_response": result if 'result' in locals() else None
        }


def analyze_resume_with_job(resume_text: str, job_description: str) -> dict:
    prompt = f"""
You are an expert ATS analyzer and resume coach.

1. Score the resume from 0 to 100 based on how well it matches the job.
2. List 3-5 positive points (good matches).
3. List 3-5 negative points (missing or weak areas).
4. Give 3 improvement suggestions to get closer to 100 ATS score.
5. Suggest 3 job roles with:
   - Job Title
   - Industry/Company Type
   - Expected Salary in INR

Resume:
{resume_text[:4000]}

Job Description:
{job_description[:2000]}
"""

    body = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    try:
        response = requests.post(
            GEMINI_API_URL,
            headers=HEADERS,
            params={"key": SmasherGEM},
            json=body,
            timeout=20
        )
        result = response.json()

        analysis = result['candidates'][0]['content']['parts'][0]['text']
        return {
            "status": "success",
            "analysis_result": analysis
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "raw_response": result if 'result' in locals() else None
        }
