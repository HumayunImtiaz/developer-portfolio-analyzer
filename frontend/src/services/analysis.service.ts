import api from './api';

export const getAnalysisReport = async (username: string) => {
  const response = await api.get(`/analysis/${username}`);
  return response.data;
};
