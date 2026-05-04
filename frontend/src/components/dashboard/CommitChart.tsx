import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CommitChartProps {
  repos: any[];
}

export const CommitChart: React.FC<CommitChartProps> = ({ repos }) => {
  // Mock commit data generation based on repository pushes/creation dates
  // In a real app, this would require querying the Events or Commits API for the user
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const data: any[] = [];
    
    // Generate last 6 months labels
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        name: months[d.getMonth()],
        commits: 0,
        monthIndex: d.getMonth(),
        year: d.getFullYear()
      });
    }

    // Distribute proxy commit counts across the last 6 months
    repos.forEach(repo => {
      const pushedDate = new Date(repo.pushed_at || repo.created_at || new Date());
      const repoSize = repo.size || 10;
      
      const monthDiff = (now.getFullYear() - pushedDate.getFullYear()) * 12 + now.getMonth() - pushedDate.getMonth();
      
      if (monthDiff >= 0 && monthDiff < 6) {
        const index = 5 - monthDiff;
        // Approximation: size / 10 to represent recent commits
        data[index].commits += Math.max(1, Math.floor(repoSize / 50)); 
      }
    });

    return data;
  }, [repos]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">{label}</p>
          <p className="text-primary font-bold">
            {payload[0].value} <span className="text-sm font-normal text-slate-500">estimated commits</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col min-h-[300px]">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recent Activity (Last 6 Months)</h3>
      <div className="flex-grow w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
            <Bar dataKey="commits" radius={[4, 4, 4, 4]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill="#6366f1" className="hover:opacity-80 transition-opacity" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-center text-slate-500 mt-4">* Estimated based on repository size and last push date</p>
    </div>
  );
};
