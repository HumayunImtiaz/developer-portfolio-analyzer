import { useState } from 'react';
import { compareGithubProfiles } from '../services/compare.service';

export const useCompare = () => {
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username1?: string, username2?: string }>({});

  const compareUsers = async (username1: string, username2: string) => {
    if (!username1.trim() || !username2.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setFieldErrors({});
      const data = await compareGithubProfiles(username1, username2);
      setComparison(data.comparison);
    } catch (err: any) {
      if (err.response?.data?.field) {
        setFieldErrors({ [err.response.data.field]: err.response.data.message });
      } else {
        setError(err.response?.data?.message || 'An error occurred during comparison.');
      }
      setComparison(null);
    } finally {
      setLoading(false);
    }
  };

  const clearCompare = () => {
    setComparison(null);
    setError(null);
    setFieldErrors({});
  };

  return { comparison, loading, error, fieldErrors, compareUsers, clearCompare };
};
