import React, { useState } from 'react';
import { UploadCloud, FileText, BrainCircuit } from 'lucide-react';
import { marked } from 'marked';


function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const highlightKeywords = [
    "Agile", "RESTful", "CI/CD", "Testing", "Version Control", "Scalability",
    "Performance Optimization", "AWS", "Azure", "GCP", "DSA", "LeetCode", "Algorithms",
    "Data Structures", "Problem Solving", "System Design", "Microservices", "Cloud Computing",
    "Containerization", "Docker", "Kubernetes", "DevOps", "Continuous Integration", "Continuous Deployment",
    "Software Development Life Cycle", "SDLC", "Agile Methodologies", "Scrum", "Kanban", "Cross-Functional Teams",
    "Full Stack Development", "Frontend", "Backend", "JavaScript", "React", "Node.js", "Python", "Java",
    "C#", "Ruby", "PHP", "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "GraphQL", "REST APIs",
    "Web Development", "Mobile Development", "iOS", "Android", "UI/UX Design", "User Experience",
    "User Interface", "Responsive Design", "Accessibility", "Performance Tuning", "Code Review",
    "Debugging", "Troublesshooting", "Problem Analysis", "Technical Documentation",
    "Agile Practices", "Scrum Ceremonies", "Sprint Planning", "Retrospectives", "Backlog Grooming",
    "User Stories", "Acceptance Criteria", "Test-Driven Development", "Behavior-Driven Development",
    "Continuous Feedback", "Collaboration", "Communication", "Teamwork", "Mentorship", "Leadership",
    "Time Management", "Prioritization", "Adaptability", "Critical Thinking",
    "Attention to Detail", "Analytical Skills", "Creativity", "Innovation", "Continuous Learning",
    "Technical Skills", "Soft Skills", "Interpersonal Skills", "Collaboration Tools",
    "Version Control Systems", "Git", "GitHub", "Bitbucket", "Agile Tools", "JIRA",
    "Trello", "Confluence", "Slack", "Zoom", "Microsoft Teams", "Communication Tools",
    "Documentation Tools", "Markdown", "Google Docs", "Technical Writing",
    "Code Quality", "Code Standards", "Code Refactoring", "Code Optimization", "Code Reviews",
    "Unit Testing", "Integration Testing", "End-to-End Testing", "Test Automation",
    "Performance Testing", "Load Testing", "Security Testing", "Penetration Testing",
    "Continuous Integration Tools", "Jenkins"
  ];

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
  if (!resumeFile || !jobDescription.trim()) {
    alert("Please upload a resume and paste the job description.");
    return;
  }

  setIsLoading(true);
  setAnalysisResult(null);

  const formData = new FormData();
  formData.append("file", resumeFile);
  formData.append("job_description", jobDescription);

  // use env var with fallback
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL ||
    "https://resumeanalyzer-backend-ocw2.onrender.com";

  try {
    const response = await fetch(`${backendUrl}/analyze-resume/`, {
      method: "POST",
      body: formData,
    });

    let result;
    try {
      result = await response.json();
    } catch (jsonErr) {
      console.error("Failed to parse JSON from backend:", jsonErr);
      const text = await response.text();
      console.error("Raw response body:", text);
      alert("Unexpected response format from server."); 
      return;
    }

    console.log("Analysis Result Raw:", result);

    if (!response.ok) {
      alert(
        `Server returned status ${response.status}: ${
          result.message || JSON.stringify(result)
        }`
      );
      return;
    }

    // Normalize where the actual analysis text lives:
    let analysisText = null;
    if (result.analysis?.analysis_result) {
      analysisText = result.analysis.analysis_result;
    } else if (result.analysis_result) {
      analysisText = result.analysis_result;
    } else if (result.analysis) {
      analysisText = JSON.stringify(result.analysis);
    }

    if (result.status === "success" && analysisText) {
      setAnalysisResult(analysisText);
    } else {
      console.warn("Unexpected result shape:", result);
      alert(
        "Analysis succeeded but response format was unexpected. Check console for details."
      );
    }
  } catch (error) {
    console.error("Error analyzing resume:", error);
    alert("Error occurred while analyzing. See console for details.");
  } finally {
    setIsLoading(false);
  }
};


  const highlightMatchingKeywords = (text) => {
  let highlighted = text;

  // ✅ Highlight matched keywords in green
  highlightKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    highlighted = highlighted.replace(
      regex,
      '<span class="text-green-600 font-semibold">$1</span>'
    );
  });

  // 🔴 Find "Missing Keywords:" line and wrap keywords in red
  const missingSectionRegex = /Missing Keywords:\s*(.*?)(?=\n|$)/i;
  const match = highlighted.match(missingSectionRegex);

  if (match && match[1]) {
    const rawKeywords = match[1]
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const redHTML = rawKeywords
      .map(k => `<span class="text-red-600 font-semibold">${k}</span>`)
      .join(', ');

    highlighted = highlighted.replace(missingSectionRegex, `Missing Keywords: ${redHTML}`);
  }

  return highlighted;
};


  return (<div className={`${darkMode ? 'dark' : ''}`}>
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <nav className={`p-4 shadow-md flex items-center justify-between ${darkMode ? 'bg-gray-900 text-white' : 'bg-blue-900 text-white'}`}>
  <h1 className="text-xl font-bold">ResumeAnalyzer 🚀</h1>
  <h1 className="text-xl font-bold">Build with ❤️ By Chirang</h1>
  

  <button
    onClick={() => setDarkMode(!darkMode)}
    className="bg-white text-gray-900 px-3 py-1 rounded-md text-sm hover:bg-gray-200"
  >
    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
  </button>
</nav>


      <main className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        <section className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
  <h2 className="text-2xl font-semibold flex items-center gap-2">
    <UploadCloud className="w-6 h-6" /> Upload Your Resume (PDF)
  </h2>
  
  <input
    type="file"
    accept=".pdf,.docx,.jpg,.jpeg,.png"
    onChange={handleFileChange}
    className="mt-4 block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 text-gray-900"
  />
</section>


        <section className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
  <h2 className="text-2xl font-semibold flex items-center gap-2">
    <FileText className="w-6 h-6" /> Paste Job Description
  </h2>
  <textarea
    rows="6"
    value={jobDescription}
    onChange={(e) => setJobDescription(e.target.value)}
    placeholder="Paste the job description here..."
    className={`mt-4 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
  ></textarea>
</section>


        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition"
          >
            <BrainCircuit className="w-5 h-5" />
            Analyze Resume
          </button>
        </div>

        {/* Spinner */}
        {isLoading && (
          <div className="text-center mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Analyzing resume...</p>
          </div>
        )}

        {/* Results */}
        {analysisResult && (
          <section className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
  <h2 className="text-2xl font-semibold mb-4">🧠 Analysis Result</h2>
  <div
  className={`prose max-w-none p-6 rounded-lg border ${
    darkMode
      ? 'bg-gray-900 text-gray-100 border-gray-700'
      : 'bg-gray-50 text-gray-900 border-gray-200'
  } prose-h2:text-lg prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-2 prose-strong:text-base`}
  dangerouslySetInnerHTML={{
    __html: marked(highlightMatchingKeywords(analysisResult)),
  }}
></div>



</section>

        )}
      </main>
    </div>
    </div>
  );
}

export default App;
