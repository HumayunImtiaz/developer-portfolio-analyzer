import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface HeaderProps {
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="flex justify-between items-center py-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={onLogoClick}
      >
        <div className="bg-primary text-white p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
          <GithubIcon size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-primary transition-colors duration-300">
            GitHub Profile Analyzer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Discover insights with style</p>
        </div>
      </div>

      <button 
        onClick={toggleTheme}
        className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 text-slate-700 dark:text-slate-200"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
};
