import api from './api';

export const compareGithubProfiles = async (username1: string, username2: string) => {
  const response = await api.post('/compare', { username1, username2 });
  return response.data;
};
