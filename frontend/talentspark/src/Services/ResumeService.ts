import api from "./api";

export type ResumeAnalysisResponse = {
  analysis: string;
};

export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysisResponse> => {
  const response = await api.post<ResumeAnalysisResponse>("/rag/analyse-resume", {
    resume_text: resumeText,
  });
  return response.data;
};
