import React from 'react';
import { Star, GitFork, BookOpen, Hash } from 'lucide-react';

interface CompareCardProps {
  user1Data: any;
  user2Data: any;
}

export const CompareCard: React.FC<CompareCardProps> = ({ user1Data, user2Data }) => {
  const getBetterClass = (val1: number, val2: number, isUser1: boolean) => {
    if (val1 === val2) return 'text-slate-800 dark:text-white font-bold';
    if (isUser1) {
      return val1 > val2 ? 'text-green-600 dark:text-green-400 font-black' : 'text-slate-500 dark:text-slate-400 font-medium';
    } else {
      return val2 > val1 ? 'text-green-600 dark:text-green-400 font-black' : 'text-slate-500 dark:text-slate-400 font-medium';
    }
  };

  const u1Stats = user1Data.profile.stats;
  const u2Stats = user2Data.profile.stats;

  const stats = [
    { label: 'Total Stars', icon: <Star size={18} />, val1: u1Stats?.totalStars || 0, val2: u2Stats?.totalStars || 0 },
    { label: 'Total Forks', icon: <GitFork size={18} />, val1: u1Stats?.totalForks || 0, val2: u2Stats?.totalForks || 0 },
    { label: 'Repos with Readme', icon: <BookOpen size={18} />, val1: u1Stats?.reposWithReadme || 0, val2: u2Stats?.reposWithReadme || 0 },
    { label: 'Total Repos', icon: <Hash size={18} />, val1: user1Data.repositories?.length || 0, val2: user2Data.repositories?.length || 0 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto glass-card overflow-hidden mt-8">
      <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="p-6 text-center border-r border-slate-200 dark:border-slate-700">
          <img src={user1Data.profile.avatarUrl} alt={user1Data.profile.username} className="w-20 h-20 rounded-full mx-auto mb-3 ring-4 ring-white dark:ring-slate-800" />
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">{user1Data.profile.username}</h3>
        </div>
        <div className="p-6 flex items-center justify-center">
          <span className="text-sm font-bold text-slate-400 tracking-widest uppercase">Comparison</span>
        </div>
        <div className="p-6 text-center border-l border-slate-200 dark:border-slate-700">
          <img src={user2Data.profile.avatarUrl} alt={user2Data.profile.username} className="w-20 h-20 rounded-full mx-auto mb-3 ring-4 ring-white dark:ring-slate-800" />
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">{user2Data.profile.username}</h3>
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {stats.map((stat, idx) => (
          <div key={idx} className="grid grid-cols-3 items-center">
            <div className={`p-4 text-center text-lg ${getBetterClass(stat.val1, stat.val2, true)}`}>
              {stat.val1.toLocaleString()}
            </div>
            <div className="p-4 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/20 text-sm font-medium">
              {stat.icon} <span className="hidden sm:inline">{stat.label}</span>
            </div>
            <div className={`p-4 text-center text-lg ${getBetterClass(stat.val1, stat.val2, false)}`}>
              {stat.val2.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
