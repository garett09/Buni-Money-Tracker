'use client';

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { FiSettings, FiDroplet } from 'react-icons/fi';

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
          onClick={() => setTheme('blue')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            theme === 'blue'
              ? 'bg-blue-500/30 text-blue-300 shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Blue</span>
        </button>
        
        <button
          onClick={() => setTheme('pink')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            theme === 'pink'
              ? 'bg-pink-500/30 text-pink-300 shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span>Pink</span>
        </button>
      </div>
    </div>
  );
};

export default ThemePicker;
