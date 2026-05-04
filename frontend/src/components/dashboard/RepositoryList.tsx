import { useState } from 'react';
import { Star, GitFork, Clock } from 'lucide-react';
import type { GitHubRepo } from '../../types/github';
import { RepositoryItem } from './RepositoryItem';

interface RepositoryListProps {
  repos: GitHubRepo[];
}

export const RepositoryList = ({ repos }: RepositoryListProps) => {
  const [showForked, setShowForked] = useState(false);
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'updated'>('updated');

  const filteredRepos = repos.filter(repo => showForked ? true : !repo.fork);
  
  const sortedRepos = [...filteredRepos].sort((a, b) => {
    if (sortBy === 'stars') return (b.stargazers_count || 0) - (a.stargazers_count || 0);
    if (sortBy === 'forks') return (b.forks_count || 0) - (a.forks_count || 0);
    
    const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
    const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="w-full mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          Repositories 
          <span className="bg-primary/10 text-primary text-sm py-0.5 px-2.5 rounded-full">
            {filteredRepos.length}
          </span>
        </h3>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={showForked}
              onChange={(e) => setShowForked(e.target.checked)}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary dark:border-slate-600 dark:bg-slate-700 cursor-pointer"
            />
            Show forked repositories
          </label>

          <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
            <button
              onClick={() => setSortBy('stars')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'stars' 
                  ? 'bg-slate-900 text-white dark:bg-primary dark:text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Star size={14} /> Stars
            </button>
            <button
              onClick={() => setSortBy('forks')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'forks' 
                  ? 'bg-slate-900 text-white dark:bg-primary dark:text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <GitFork size={14} /> Forks
            </button>
            <button
              onClick={() => setSortBy('updated')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'updated' 
                  ? 'bg-slate-900 text-white dark:bg-primary dark:text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Clock size={14} /> Updated
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sortedRepos.length > 0 ? (
          sortedRepos.map(repo => (
            <RepositoryItem key={repo.id} repo={repo} />
          ))
        ) : (
          <div className="glass-card p-8 text-center text-slate-500 dark:text-slate-400">
            No repositories found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
