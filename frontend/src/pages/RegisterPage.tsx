import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 w-full flex-grow">
      <RegisterForm />
      <p className="mt-6 text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};
