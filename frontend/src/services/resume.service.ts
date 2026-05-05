import api from './api';

export interface ResumeAnalysisResponse {
  success: boolean;
  data: {
    atsScore: number;
    strengths: string[];
    improvements: string[];
    tips: string[];
  };
}

export const analyzeResume = async (formData: FormData): Promise<ResumeAnalysisResponse> => {
  const response = await api.post('/resume/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
