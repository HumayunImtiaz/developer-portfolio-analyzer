import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  icon,
  iconBgColor = 'bg-primary/10 dark:bg-primary/20',
  iconColor = 'text-primary'
}: StatCardProps) => {
  return (
    <div className="glass-card p-6 flex items-center gap-5">
      <div className={`p-4 rounded-xl ${iconBgColor} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
};
