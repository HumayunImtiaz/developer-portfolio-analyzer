import React from 'react';
import { TrendingUp, Zap, Shield } from 'lucide-react';
import { GithubIcon } from '../components/GithubIcon';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 w-full max-w-5xl mx-auto animate-fade-in-up">
      <div className="bg-primary/10 text-primary p-4 rounded-2xl mb-8 animate-float">
        <GithubIcon size={48} />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-black text-center text-slate-800 dark:text-white leading-tight mb-6 tracking-tight">
        Analyze GitHub Profiles <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">
          with AI Precision
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-center text-slate-600 dark:text-slate-400 max-w-2xl mb-12">
        Get deep insights, skill assessments, and AI-driven feedback on any GitHub developer's profile instantly.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
        <Link 
          to="/register" 
          className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1 text-center"
        >
          Get Started for Free
        </Link>
        <Link 
          to="/login" 
          className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary/50 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-lg transition-all text-center"
        >
          Sign In
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Instant Analysis</h3>
          <p className="text-slate-600 dark:text-slate-400">Fetch real-time data from GitHub and get immediate statistics.</p>
        </div>
        
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">AI Scoring</h3>
          <p className="text-slate-600 dark:text-slate-400">Gemini AI evaluates the profile and provides an objective skill score.</p>
        </div>
        
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-4">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Actionable Feedback</h3>
          <p className="text-slate-600 dark:text-slate-400">Discover strengths and get clear tips on how to improve the profile.</p>
        </div>
      </div>
    </div>
  );
};
