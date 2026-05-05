import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, ArrowLeft } from 'lucide-react';
import type { ResumeAnalysisResponse } from '../../services/resume.service';

interface ResumeResultProps {
  result: ResumeAnalysisResponse['data'];
  onReset: () => void;
}

export const ResumeResult: React.FC<ResumeResultProps> = ({ result, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score >= 71) return 'text-emerald-500 border-emerald-500';
    if (score >= 41) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 71) return 'bg-emerald-50 dark:bg-emerald-900/20';
    if (score >= 41) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Score Section */}
        <div className={`glass-card p-8 rounded-3xl flex flex-col items-center justify-center min-w-[250px] ${getScoreBg(result.atsScore)}`}>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">ATS Match Score</h3>
          <div className={`w-40 h-40 rounded-full border-8 flex items-center justify-center ${getScoreColor(result.atsScore)} bg-white dark:bg-slate-900 shadow-inner`}>
            <span className="text-5xl font-black">{result.atsScore}</span>
            <span className="text-xl font-medium text-slate-400 ml-1">%</span>
          </div>
          <p className="mt-6 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
            {result.atsScore >= 71 ? 'Excellent match!' : result.atsScore >= 41 ? 'Good, but needs work.' : 'Requires major improvements.'}
          </p>
        </div>

        {/* Details Section */}
        <div className="flex-1 space-y-6 w-full">
          {/* Strengths */}
          <div className="glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500">
            <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-4">
              <CheckCircle2 size={20} />
              Strengths
            </h3>
            <ul className="space-y-3">
              {result.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="glass-card p-6 rounded-2xl border-l-4 border-l-yellow-500">
            <h3 className="text-lg font-bold flex items-center gap-2 text-yellow-700 dark:text-yellow-400 mb-4">
              <AlertTriangle size={20} />
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {result.improvements.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500">
            <h3 className="text-lg font-bold flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-4">
              <Lightbulb size={20} />
              Actionable Tips
            </h3>
            <ul className="space-y-3">
              {result.tips.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-all"
        >
          <ArrowLeft size={18} />
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
};
