import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface CompareInputProps {
  onCompare: (username1: string, username2: string) => void;
  isLoading: boolean;
  fieldErrors?: { username1?: string, username2?: string };
}

export const CompareInput: React.FC<CompareInputProps> = ({ onCompare, isLoading, fieldErrors }) => {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user1.trim() && user2.trim()) {
      onCompare(user1.trim(), user2.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto glass-card p-6 flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Username</label>
        <input
          type="text"
          value={user1}
          onChange={(e) => setUser1(e.target.value)}
          placeholder="e.g. defunkt"
          className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border ${fieldErrors?.username1 ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-200 dark:border-slate-700 focus:ring-primary/50'} rounded-xl focus:outline-none focus:ring-2 text-slate-800 dark:text-white`}
        />
        {fieldErrors?.username1 && <p className="text-red-500 text-sm mt-1">{fieldErrors.username1}</p>}
      </div>
      
      <div className="hidden md:flex items-center justify-center pt-6 px-2">
        <span className="text-xl font-black text-slate-300 dark:text-slate-600">VS</span>
      </div>
      
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Second Username</label>
        <input
          type="text"
          value={user2}
          onChange={(e) => setUser2(e.target.value)}
          placeholder="e.g. torvalds"
          className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border ${fieldErrors?.username2 ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-200 dark:border-slate-700 focus:ring-primary/50'} rounded-xl focus:outline-none focus:ring-2 text-slate-800 dark:text-white`}
        />
        {fieldErrors?.username2 && <p className="text-red-500 text-sm mt-1">{fieldErrors.username2}</p>}
      </div>

      <div className="w-full md:w-auto pt-0 md:pt-6">
        <button
          type="submit"
          disabled={isLoading || !user1.trim() || !user2.trim()}
          className="w-full md:w-auto py-2.5 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          Compare
        </button>
      </div>
    </form>
  );
};
