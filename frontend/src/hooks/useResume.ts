import { useState } from 'react';
import { analyzeResume } from '../services/resume.service';
import type { ResumeAnalysisResponse } from '../services/resume.service';

export const useResume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [result, setResult] = useState<ResumeAnalysisResponse['data'] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeAnalysis = async () => {
    if (!file) {
      setError('Please select a file to analyze.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription);
      }

      const response = await analyzeResume(formData);
      if (response.success) {
        setResult(response.data);
      } else {
        setError('Analysis returned a failure response.');
      }
    } catch (err: any) {
      console.error('Resume Analysis Error:', err);
      setError(
        err.response?.data?.message || 'An error occurred while analyzing the resume. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setJobDescription('');
    setResult(null);
    setError(null);
  };

  return {
    file,
    setFile,
    jobDescription,
    setJobDescription,
    result,
    loading,
    error,
    executeAnalysis,
    resetAnalysis,
  };
};
