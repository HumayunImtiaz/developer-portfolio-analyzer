import { LogOut } from 'lucide-react';
import { GithubIcon } from '../../components/GithubIcon';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full py-4 px-6 sm:px-8 flex items-center justify-between animate-fade-in border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3 group transition-transform hover:scale-105">
        <div className="bg-primary/10 text-primary p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          <GithubIcon size={28} />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500 tracking-tight">
          GitProfile
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/compare" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
              Compare
            </Link>
            <Link to="/resume" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
              Resume
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <span className="text-sm font-medium text-slate-500 hidden sm:block">Hi, {user?.name}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
