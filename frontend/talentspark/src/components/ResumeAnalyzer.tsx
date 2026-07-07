import { useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { analyzeResume } from "../Services/ResumeService";
import "./ChatBox.css";

GlobalWorkerOptions.workerSrc = workerSrc;

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let extractedText = "";

    for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
      const page = await pdf.getPage(pageIndex);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");
      extractedText += `${pageText}\n`;
    }

    return extractedText.trim();
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await analyzeResume(resumeText.trim());
      setAnalysis(response.analysis);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Unable to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const extractedText = await extractTextFromPdf(file);
      setResumeText(extractedText);
      setAnalysis("");
    } catch (err: any) {
      setError(err?.message || "Unable to read PDF file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h2>Resume Analyzer</h2>
      <p className="chat-empty">
        Paste resume text or upload a PDF to get an AI-powered analysis of skills, experience, strengths, and improvement areas.
      </p>

      <label htmlFor="resume-upload" style={{ display: "inline-block", marginBottom: "0.75rem", fontWeight: 600 }}>
        Upload PDF Resume
      </label>
      <input
        id="resume-upload"
        type="file"
        accept="application/pdf"
        onChange={handlePdfUpload}
        style={{ marginBottom: "0.75rem" }}
      />

      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste resume content here or upload a PDF..."
        rows={10}
        style={{ width: "100%", resize: "vertical", padding: "0.75rem", borderRadius: "0.75rem", border: "1px solid #d1d5db" }}
      />

      <div className="chat-input-container" style={{ marginTop: "0.75rem" }}>
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {error && <div className="chat-error">{error}</div>}

      {analysis && (
        <div className="chat-messages" style={{ marginTop: "1rem" }}>
          <div className="chat-message bot">
            <div className="message-role">Analysis:</div>
            <div className="message-text" style={{ whiteSpace: "pre-wrap" }}>{analysis}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;
