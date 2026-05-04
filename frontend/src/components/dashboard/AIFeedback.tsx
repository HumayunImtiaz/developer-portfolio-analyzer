import React from 'react';
import { CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

interface AIFeedbackProps {
  strengths?: string[];
  improvements?: string[];
  tips?: string[];
  isLoading?: boolean;
}

export const AIFeedback: React.FC<AIFeedbackProps> = ({ strengths, improvements, tips, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card p-6 h-full flex flex-col gap-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">AI Feedback Analysis</h3>
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!strengths && !improvements && !tips) {
    return null;
  }

  return (
    <div className="glass-card p-6 h-full flex flex-col gap-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">AI Feedback Analysis</h3>
      
      {strengths && strengths.length > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30">
          <h4 className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold mb-3">
            <CheckCircle size={18} /> Strengths
          </h4>
          <ul className="space-y-2">
            {strengths.map((item, idx) => (
              <li key={idx} className="text-slate-700 dark:text-slate-300 text-sm flex items-start">
                <span className="mr-2 mt-1 block w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {improvements && improvements.length > 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
          <h4 className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 font-bold mb-3">
            <AlertTriangle size={18} /> Areas for Improvement
          </h4>
          <ul className="space-y-2">
            {improvements.map((item, idx) => (
              <li key={idx} className="text-slate-700 dark:text-slate-300 text-sm flex items-start">
                <span className="mr-2 mt-1 block w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tips && tips.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold mb-3">
            <Lightbulb size={18} /> Pro Tips
          </h4>
          <ul className="space-y-2">
            {tips.map((item, idx) => (
              <li key={idx} className="text-slate-700 dark:text-slate-300 text-sm flex items-start">
                <span className="mr-2 mt-1 block w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
