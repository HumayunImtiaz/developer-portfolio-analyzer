import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { LanguageStat } from '../../types/github';

interface LanguageChartProps {
  data: LanguageStat[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700">
        <p className="font-semibold text-slate-800 dark:text-white" style={{ color: data.color }}>
          {data.name}
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          {data.value} {data.value === 1 ? 'repo' : 'repos'}
        </p>
      </div>
    );
  }
  return null;
};

export const LanguageChart: React.FC<LanguageChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-slate-500">
        No language data available
      </div>
    );
  }

  // Calculate percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: Math.round((item.value / total) * 100)
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name, color }: any) => {
    const RADIAN = Math.PI / 180;
    // Position label further out
    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill={color} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs md:text-sm font-medium"
      >
        {`${name} ${percentage}%`}
      </text>
    );
  };

  return (
    <div className="h-full min-h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithPercentage}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {dataWithPercentage.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
