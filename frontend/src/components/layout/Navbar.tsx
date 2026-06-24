import { LogOut, LayoutDashboard, GitCompare, FileText, UserCircle } from 'lucide-react';
import { GithubIcon } from '../../components/GithubIcon';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Profile Analysis', icon: LayoutDashboard },
    { path: '/compare', label: 'Compare', icon: GitCompare },
    { path: '/resume', label: 'Resume', icon: FileText }
  ];

  return (
    <header className="w-full py-4 px-6 sm:px-8 flex items-center justify-between animate-fade-in border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-50">
      <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3 group transition-transform hover:scale-105">
        <div className="bg-gradient-to-br from-primary/20 to-indigo-500/20 text-primary p-2 rounded-xl group-hover:from-primary group-hover:to-indigo-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-primary/30">
          <GithubIcon size={24} />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500 tracking-tight">
          GitProfile
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <nav className="hidden sm:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-inner">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 scale-100' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-white/60 dark:hover:bg-slate-700/50 hover:scale-105'
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-primary" : "text-current opacity-70"} />
                    <span className="hidden lg:inline">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile simplified nav */}
            <div className="flex sm:hidden gap-2">
               {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link 
                    key={'mobile-'+link.path}
                    to={link.path} 
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-primary'
                    }`}
                  >
                    <Icon size={20} />
                  </Link>
                );
              })}
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 sm:mx-2 hidden sm:block"></div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hidden md:flex">
                <UserCircle size={18} className="text-primary opacity-80" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">{user?.name}</span>
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-xl transition-all hover:scale-105 border border-red-100 dark:border-transparent"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

