import { Request } from 'express';

// Extend Express Request to include authenticated user
export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// GitHub API user shape
export interface GithubUserData {
  login: string;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

// GitHub API repo shape
export interface GithubRepoData {
  name: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  has_wiki: boolean;
  description: string | null;
  pushed_at: string;
  created_at: string;
}

// Aggregated profile stats
export interface ProfileStats {
  totalStars: number;
  totalForks: number;
  reposWithReadme: number;
  languageMap: Record<string, number>;
}

// Gemini AI analysis result
export interface GeminiAnalysisResult {
  score: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  strengths: string[];
  improvements: string[];
  tips: string[];
}

// Queue job data
export interface AnalysisJobData {
  username: string;
  profileStats: ProfileStats;
  repos: GithubRepoData[];
  userId?: string;
}
