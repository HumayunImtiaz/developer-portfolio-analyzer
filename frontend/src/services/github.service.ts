import api from './api';

export const analyzeGithubProfile = async (username: string) => {
  const response = await api.post('/github/analyze', { username });
  return response.data;
};

export const getGithubProfile = async (username: string) => {
  const response = await api.get(`/github/profile/${username}`);
  return response.data;
};
