import { Activity, PieChart, Zap } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { SearchInput } from './SearchInput';

interface HeroProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, isLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="glass-card p-10 md:p-16 w-full max-w-4xl text-center rounded-[2.5rem] relative overflow-hidden">
        {/* Decorative background elements inside the card */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[80px]"></div>
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-pink-500/20 blur-[80px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-2xl mb-6 text-primary">
            <GithubIcon size={48} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-800 dark:text-white">
            <span className="text-primary">Hi, I'm</span> Your Name
          </h2>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            A passionate developer creating powerful analytics tools. Explore GitHub profiles with beautiful visualizations and real-time insights.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
              <Zap size={20} className="text-primary" />
              <span>Real-time Data</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
              <PieChart size={20} className="text-primary" />
              <span>Beautiful Charts</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
              <Activity size={20} className="text-primary" />
              <span>Deep Insights</span>
            </div>
          </div>

          <div className="w-full">
            <SearchInput onSearch={onSearch} isLoading={isLoading} />
          </div>
        </div>
      </div>
      
      {/* Ghost Github icon at the bottom like in the design */}
      <div className="mt-24 text-slate-200 dark:text-slate-800/50">
        <GithubIcon size={120} strokeWidth={1} />
      </div>
    </div>
  );
};
