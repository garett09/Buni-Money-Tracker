'use client';

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { FiSettings, FiMoon, FiSun } from 'react-icons/fi';

const ThemePicker: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <FiSettings size={16} style={{ color: 'var(--text-muted)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Theme</span>
      </div>
      
      <div className="flex bg-black/10 dark:bg-white/10 rounded-lg p-1">
        <button
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            theme === 'dark'
              ? 'shadow-lg'
              : 'hover:bg-black/10 dark:hover:bg-white/10'
          }`}
          style={{
            backgroundColor: theme === 'dark' ? 'var(--theme-primary)' : 'transparent',
            color: theme === 'dark' ? 'white' : 'var(--text-primary)'
          }}
        >
          <FiMoon size={14} />
          <span>Dark</span>
        </button>
        
        <button
          onClick={() => setTheme('light')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            theme === 'light'
              ? 'shadow-lg'
              : 'hover:bg-black/10 dark:hover:bg-white/10'
          }`}
          style={{
            backgroundColor: theme === 'light' ? 'var(--theme-primary)' : 'transparent',
            color: theme === 'light' ? 'white' : 'var(--text-primary)'
          }}
        >
          <FiSun size={14} />
          <span>Light</span>
        </button>
      </div>
    </div>
  );
};

export default ThemePicker;
