import { Star, GitFork, Eye, ExternalLink } from 'lucide-react';
import type { GitHubRepo } from '../../types/github';

interface RepositoryItemProps {
  repo: GitHubRepo;
}

export const RepositoryItem: React.FC<RepositoryItemProps> = ({ repo }) => {
  const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  // Fallback URL for cached data that might missing html_url
  const repoUrl = repo.html_url || `https://github.com/${repo.owner}/${repo.name}`;

  return (
    <a 
      href={repoUrl}
      target="_blank"
      rel="noreferrer"
      className="glass-card p-5 hover:-translate-y-1 transition-all duration-300 block hover:border-primary/50 group"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-primary transition-colors flex items-center gap-2">
          {repo.name}
          <ExternalLink size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </h4>
      </div>

      {repo.description && (
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
          {repo.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mt-auto pt-2">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
            {repo.language}
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <Star size={14} />
          {repo.stargazers_count}
        </div>

        <div className="flex items-center gap-1">
          <GitFork size={14} />
          {repo.forks_count}
        </div>

        <div className="flex items-center gap-1">
          <Eye size={14} />
          {repo.watchers_count}
        </div>

        <div className="ml-auto text-slate-400">
          Updated {updatedDate}
        </div>
      </div>
    </a>
  );
};
