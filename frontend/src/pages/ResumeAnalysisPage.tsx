import React from 'react';
import { useResume } from '../hooks/useResume';
import { ResumeUpload } from '../components/resume/ResumeUpload';
import { ResumeResult } from '../components/resume/ResumeResult';
import { FileText } from 'lucide-react';

export const ResumeAnalysisPage: React.FC = () => {
  const {
    file,
    setFile,
    jobDescription,
    setJobDescription,
    result,
    loading,
    error,
    executeAnalysis,
    resetAnalysis,
  } = useResume();

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-6 sm:p-8 md:p-12 animate-fade-in">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Resume Analysis
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Upload your resume to get instant ATS scoring and feedback.
            </p>
          </div>
        </div>

        <div className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 sm:p-10 shadow-xl">
          {!result ? (
            <ResumeUpload
              file={file}
              setFile={setFile}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              onAnalyze={executeAnalysis}
              loading={loading}
              error={error}
            />
          ) : (
            <ResumeResult result={result} onReset={resetAnalysis} />
          )}
        </div>
      </div>
    </div>
  );
};
