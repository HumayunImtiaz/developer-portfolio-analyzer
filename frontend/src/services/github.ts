import axios from 'axios';
import type { GitHubUser, GitHubRepo } from '../types/github';

const api = axios.create({
  baseURL: 'https://api.github.com',
});



export const getUserProfile = async (username: string): Promise<GitHubUser> => {
  const response = await api.get(`/users/${username}`);
  return response.data;
};

export const getUserRepositories = async (username: string): Promise<GitHubRepo[]> => {

  const response = await api.get(`/users/${username}/repos?per_page=100&sort=updated`);
  return response.data;
};
