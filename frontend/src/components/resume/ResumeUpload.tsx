import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Loader2, X } from 'lucide-react';

interface ResumeUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  jobDescription: string;
  setJobDescription: (desc: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  error: string | null;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  file,
  setFile,
  jobDescription,
  setJobDescription,
  onAnalyze,
  loading,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSetFile = (selectedFile: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert('Only PDF and Word (.docx) files are allowed.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Upload Your Resume</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Get an AI-powered ATS score and actionable feedback instantly.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-h-[250px] ${
          isDragging
            ? 'border-primary bg-primary/5 dark:bg-primary/10'
            : file
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 cursor-default'
            : 'border-slate-300 dark:border-slate-700 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
        />

        {file ? (
          <div className="flex flex-col items-center space-y-4 animate-fade-in text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
              <FileText size={32} />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {file.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="mt-2 text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <X size={16} /> Remove File
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 text-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
              <UploadCloud size={32} />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                Click or drag file to this area to upload
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                Support for a single PDF or DOCX file (Max 5MB).
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Job Description (Optional)
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to compare your resume against it..."
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y min-h-[120px]"
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={onAnalyze}
        disabled={!file || loading}
        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
          !file
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            : 'bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/25 hover:-translate-y-1'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={24} />
            Analyzing AI...
          </>
        ) : (
          'Analyze Resume'
        )}
      </button>
    </div>
  );
};
