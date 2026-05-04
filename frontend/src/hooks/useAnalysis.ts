import { useState, useEffect } from 'react';
import { getAnalysisReport } from '../services/analysis.service';

export const useAnalysis = (username: string, initialPending: boolean) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(initialPending);

  useEffect(() => {
    setIsPolling(initialPending);
  }, [initialPending]);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;

    const pollAnalysis = async () => {
      try {
        const data = await getAnalysisReport(username);
        if (data.success && data.analysis) {
          setAnalysis(data.analysis);
          if (data.analysis.status === 'completed' || data.analysis.status === 'failed') {
            setIsPolling(false);
          }
        }
      } catch (error) {
        console.error('Failed to poll analysis', error);
      }
    };

    if (isPolling && username) {
      interval = setInterval(pollAnalysis, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling, username]);

  return { analysis, isPolling };
};
