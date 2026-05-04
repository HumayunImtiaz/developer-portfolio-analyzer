import { useState } from 'react';
import { analyzeGithubProfile } from '../services/github.service';

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
};

export const useGitHub = () => {
  const [profile, setProfile] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUser = async (username: string) => {
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await analyzeGithubProfile(username);
      
      setProfile(data.profile);
      setRepos(data.repositories);
      setAnalysis(data.analysis);

      // Transform languageMap into array format expected by LanguageChart
      const languageMap = data.profile.stats?.languageMap || {};
      const languages = Object.entries(languageMap)
        .map(([name, count]: [string, any]) => ({
          name,
          value: count,
          color: LANGUAGE_COLORS[name] || '#ccc',
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      setStats({
        totalStars: data.profile.stats?.totalStars || 0,
        totalForks: data.profile.stats?.totalForks || 0,
        reposWithReadme: data.profile.stats?.reposWithReadme || 0,
        originalRepos: data.repositories.length, // approximation
        forkedRepos: data.profile.stats?.totalForks || 0, // Not exact, but matches UI shape
        languages,
      });

    } catch (err: any) {
      let errorMsg = 'An error occurred while fetching data.';
      if (err.response?.status === 404) {
        errorMsg = 'User not found on GitHub.';
      } else if (err.response?.status === 429) {
        errorMsg = 'API rate limit exceeded. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      // Clear profile data but keep error visible
      setProfile(null);
      setRepos([]);
      setStats(null);
      setAnalysis(null);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setProfile(null);
    setRepos([]);
    setStats(null);
    setAnalysis(null);
    setError(null);
  };

  return { profile, repos, stats, analysis, setAnalysis, loading, error, searchUser, clearSearch };
};
