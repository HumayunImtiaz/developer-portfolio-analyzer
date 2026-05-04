import React, { useEffect, useState } from 'react';

interface ScoreCardProps {
  score?: number;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  isLoading?: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score = 0, skillLevel, isLoading }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (isLoading || !score) {
      setAnimatedScore(0);
      return;
    }
    
    // Animate score from 0 to actual score
    let start = 0;
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / score));
    
    const timer = setInterval(() => {
      start += 1;
      setAnimatedScore(start);
      if (start === score) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [score, isLoading]);

  const getColor = (s: number) => {
    if (s <= 40) return 'text-red-500 stroke-red-500';
    if (s <= 70) return 'text-yellow-500 stroke-yellow-500';
    return 'text-green-500 stroke-green-500';
  };

  const colorClass = getColor(animatedScore);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center relative min-h-[250px]">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 w-full text-left">AI Profile Score</h3>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-32 h-32 rounded-full border-4 border-slate-200 dark:border-slate-700 animate-pulse flex items-center justify-center">
            <span className="text-slate-400">Analyzing...</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`${colorClass.split(' ')[1]} transition-all duration-300 ease-out`}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${colorClass.split(' ')[0]}`}>
                {animatedScore}
              </span>
              <span className="text-sm text-slate-500 font-medium">/ 100</span>
            </div>
          </div>
          
          {skillLevel && (
            <div className={`mt-4 px-4 py-1.5 rounded-full font-bold text-sm ${
              skillLevel === 'Advanced' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              skillLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {skillLevel}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
