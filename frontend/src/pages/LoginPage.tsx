import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 w-full flex-grow">
      <LoginForm />
      <p className="mt-6 text-slate-600 dark:text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};
