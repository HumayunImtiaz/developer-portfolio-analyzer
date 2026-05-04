import React from 'react';
import { SearchInput } from '../components/SearchInput';
import { ProfileCard } from '../components/dashboard/ProfileCard';
import { StatCard } from '../components/dashboard/StatCard';
import { LanguageChart } from '../components/dashboard/LanguageChart';
import { RepositoryList } from '../components/dashboard/RepositoryList';
import { ScoreCard } from '../components/dashboard/ScoreCard';
import { AIFeedback } from '../components/dashboard/AIFeedback';
import { CommitChart } from '../components/dashboard/CommitChart';
import { useGitHub } from '../hooks/useGitHub';
import { useAnalysis } from '../hooks/useAnalysis';
import { Star, GitFork, Box, GitMerge } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { profile, repos, stats, analysis, loading, error, searchUser, clearSearch } = useGitHub();
  
  // Determine if it's a field-level error (user not found) or a general error
  const isFieldError = error && (error.toLowerCase().includes('not found') || error.toLowerCase().includes('failed to fetch'));
  const fieldError = isFieldError ? error : null;
  const generalError = !isFieldError ? error : null;
  
  // Custom hook to poll for analysis if it's pending
  const { analysis: polledAnalysis, isPolling } = useAnalysis(
    profile?.username || '', 
    analysis?.pending || false
  );

  // Use polled analysis if available, otherwise use initial analysis
  const currentAnalysis = polledAnalysis || analysis;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col flex-grow">
      <div className="flex flex-col items-center mb-10 w-full animate-fade-in-up">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-6 text-center">
          Analyze Any <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">GitHub Profile</span>
        </h2>
        <div className="w-full max-w-2xl">
          <SearchInput 
            onSearch={searchUser} 
            isLoading={loading} 
            initialValue={profile?.username || ''} 
            fieldError={fieldError}
            onClearError={clearSearch}
          />
        </div>
      </div>

      {generalError && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-center border border-red-200 dark:border-red-800 mb-8 animate-fade-in">
          {generalError}
        </div>
      )}

      {loading && !profile && (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {profile && stats && (
        <div className="w-full flex flex-col gap-8 pb-16 animate-fade-in">
          
          <ProfileCard user={{
            login: profile.username,
            avatar_url: profile.avatarUrl,
            html_url: `https://github.com/${profile.username}`,
            name: profile.name,
            company: profile.company,
            blog: profile.blog,
            location: profile.location,
            email: profile.email,
            bio: profile.bio,
            public_repos: repos.length,
            followers: profile.followers,
            following: profile.following,
            created_at: profile.createdAt
          } as any} />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard 
              title="Total Stars" 
              value={stats.totalStars} 
              icon={<Star size={24} />} 
              iconBgColor="bg-amber-100 dark:bg-amber-900/30"
              iconColor="text-amber-500"
            />
            <StatCard 
              title="Total Forks" 
              value={stats.totalForks} 
              icon={<GitFork size={24} />} 
              iconBgColor="bg-blue-100 dark:bg-blue-900/30"
              iconColor="text-blue-500"
            />
            <StatCard 
              title="Original Repos" 
              value={stats.originalRepos} 
              icon={<Box size={24} />} 
              iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
              iconColor="text-emerald-500"
            />
            <StatCard 
              title="Forked Repos" 
              value={stats.forkedRepos} 
              icon={<GitMerge size={24} />} 
              iconBgColor="bg-purple-100 dark:bg-purple-900/30"
              iconColor="text-purple-500"
            />
          </div>

          {/* AI Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currentAnalysis?.status === 'failed' ? (
              <div className="lg:col-span-3 glass-card p-8 border-l-4 border-l-red-500 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <Box size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">AI Analysis Failed</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                  We couldn't complete the AI analysis for this profile. This is usually due to AI API rate limits. Please try again in a minute.
                </p>
                <button 
                  onClick={() => searchUser(profile.username)}
                  className="mt-6 btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="lg:col-span-1">
                  <ScoreCard 
                    score={currentAnalysis?.score} 
                    skillLevel={currentAnalysis?.skillLevel} 
                    isLoading={isPolling || (!currentAnalysis && !error)} 
                  />
                </div>
                <div className="lg:col-span-2">
                  <AIFeedback 
                    strengths={currentAnalysis?.strengths}
                    improvements={currentAnalysis?.improvements}
                    tips={currentAnalysis?.tips}
                    isLoading={isPolling || (!currentAnalysis && !error)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 flex flex-col h-full min-h-[300px]">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Top Languages</h3>
              <div className="flex-grow flex items-center justify-center">
                <LanguageChart data={stats.languages} />
              </div>
            </div>
            
            <div className="h-full">
               <CommitChart repos={repos} />
            </div>
          </div>

          <RepositoryList repos={repos} />
        </div>
      )}
    </div>
  );
};
