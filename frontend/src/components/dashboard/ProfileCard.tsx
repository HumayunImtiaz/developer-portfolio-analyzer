import { MapPin, Link as LinkIcon, Book, Users, UserPlus, Calendar } from 'lucide-react';
import type { GitHubUser } from '../../types/github';

interface ProfileCardProps {
  user: GitHubUser;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start relative w-full mb-8">
      {/* Avatar */}
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/50 dark:border-slate-700 shadow-xl shrink-0">
        <img 
          src={user.avatar_url} 
          alt={`${user.login}'s avatar`} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-grow w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-1">
              {user.name || user.login}
            </h2>
            <a 
              href={user.html_url} 
              target="_blank" 
              rel="noreferrer"
              className="text-primary hover:underline text-lg"
            >
              @{user.login}
            </a>
          </div>
        </div>

        {user.bio && (
          <p className="text-slate-600 dark:text-slate-300 text-lg mb-6 leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Meta details */}
        <div className="flex flex-wrap gap-y-3 gap-x-6 mb-6 text-slate-600 dark:text-slate-400">
          {user.company && (
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{user.company}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{user.location}</span>
            </div>
          )}
          {user.blog && (
            <div className="flex items-center gap-2">
              <LinkIcon size={18} />
              <a 
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank" 
                rel="noreferrer"
                className="hover:text-primary transition-colors"
              >
                {user.blog}
              </a>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 text-slate-700 dark:text-slate-300 mb-6 font-medium">
          <div className="flex items-center gap-2">
            <Book size={20} className="text-slate-400" />
            <span className="text-slate-900 dark:text-white font-bold">{user.public_repos}</span> repositories
          </div>
          <div className="flex items-center gap-2">
            <Users size={20} className="text-slate-400" />
            <span className="text-slate-900 dark:text-white font-bold">{user.followers}</span> followers
          </div>
          <div className="flex items-center gap-2">
            <UserPlus size={20} className="text-slate-400" />
            <span className="text-slate-900 dark:text-white font-bold">{user.following}</span> following
          </div>
        </div>

        <div className="text-slate-500 dark:text-slate-500 flex items-center gap-2 text-sm">
          <Calendar size={16} />
          Joined GitHub in {joinedDate}
        </div>
      </div>
    </div>
  );
};
