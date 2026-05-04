import React from 'react';
import { CompareInput } from '../components/compare/CompareInput';
import { CompareCard } from '../components/compare/CompareCard';
import { useCompare } from '../hooks/useCompare';


export const ComparePage: React.FC = () => {
  const { comparison, loading, error, fieldErrors, compareUsers } = useCompare();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col flex-grow">
      <div className="flex flex-col items-center mb-10 w-full animate-fade-in-up">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-6 text-center">
          Compare <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">GitHub Profiles</span>
        </h2>
        <CompareInput onCompare={compareUsers} isLoading={loading} fieldErrors={fieldErrors} />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-center border border-red-200 dark:border-red-800 mb-8 animate-fade-in max-w-3xl mx-auto w-full">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {comparison && (
        <div className="w-full flex flex-col gap-8 animate-fade-in">
          <CompareCard user1Data={comparison.user1} user2Data={comparison.user2} />
          
          <div className="max-w-4xl mx-auto w-full mt-4">
            <div className="glass-card p-6 border-l-4 border-l-primary">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">AI Conclusion</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {comparison.aiComparison}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
