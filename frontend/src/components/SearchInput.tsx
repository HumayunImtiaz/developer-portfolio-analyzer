import React, { useState } from 'react';

interface SearchInputProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  initialValue?: string;
  fieldError?: string | null;
  onClearError?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading, initialValue = '', fieldError, onClearError }) => {
  const [username, setUsername] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-grow flex flex-col">
          <input
            type="text"
            placeholder="Enter GitHub username..."
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (fieldError && onClearError) onClearError();
            }}
            className={`input-field ${fieldError ? 'border-red-500 focus:ring-red-500/50' : ''}`}
            disabled={isLoading}
          />
          {fieldError && (
            <p className="text-red-500 text-sm mt-1 px-1">{fieldError}</p>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isLoading || !username.trim()}
          className="btn-primary whitespace-nowrap min-w-[120px] self-start disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
        >
          {isLoading ? 'Searching...' : 'Analyze'}
        </button>
      </form>
    </div>
  );
};
