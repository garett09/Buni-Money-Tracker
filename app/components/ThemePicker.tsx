'use client';

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { FiSettings, FiMoon, FiSun } from 'react-icons/fi';

const ThemePicker: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <FiSettings className="text-white/60" size={16} />
        <span className="text-white/80 text-sm font-medium">Theme</span>
      </div>
      
      <div className="flex bg-white/10 rounded-lg p-1">
        <button
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-blue-500/30 text-blue-300 shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <FiMoon size={14} />
          <span>Dark</span>
        </button>
        
        <button
          onClick={() => setTheme('light')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            theme === 'light'
              ? 'bg-yellow-500/30 text-yellow-300 shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <FiSun size={14} />
          <span>Light</span>
        </button>
      </div>
    </div>
  );
};

export default ThemePicker;
