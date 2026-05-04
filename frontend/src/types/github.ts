export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  company: string | null;
  blog: string;
  location: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  updated_at: string;
  owner: string;
}

export interface LanguageStat {
  name: string;
  value: number;
  color: string;
}

export interface RepoStats {
  totalStars: number;
  totalForks: number;
  originalRepos: number;
  forkedRepos: number;
  languages: LanguageStat[];
}
