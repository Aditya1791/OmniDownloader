import React, { useState, useEffect } from 'react';
import { ManifestKey } from '../types';

interface HeaderBarProps {
  activeView: ManifestKey;
  directoryPath: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  showGridLines: boolean;
  onToggleGridLines: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeView,
  directoryPath,
  isDarkMode,
  onToggleDarkMode,
  showGridLines,
  onToggleGridLines,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className={`p-4 md:px-10 border-b-[1.5px] ${isDarkMode ? 'border-white bg-black text-white' : 'border-black bg-white text-black'} flex flex-wrap justify-between items-center transition-colors duration-200 select-none`}>
      <div className="flex items-center gap-4 md:gap-8">
        <span className="font-mono-custom text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-current animate-pulse"></span>
          Google AI Studio
        </span>
        <span className="hidden sm:inline-block font-mono-custom text-xs uppercase tracking-wider text-neutral-500">
          Directory: {directoryPath}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono-custom">
        <span className="hidden md:inline-block text-neutral-500">
          [{timeStr || '12:00:00 UTC'}]
        </span>

        <button
          onClick={onToggleGridLines}
          title="Toggle Grid Lines"
          className={`px-2 py-1 border-[1.5px] ${isDarkMode ? 'border-white hover:bg-white hover:text-black' : 'border-black hover:bg-black hover:text-white'} transition-colors cursor-pointer text-[10px] uppercase font-bold`}
        >
          {showGridLines ? 'Grid: ON' : 'Grid: OFF'}
        </button>

        <button
          onClick={onToggleDarkMode}
          title="Toggle Theme Inversion"
          className={`px-2 py-1 border-[1.5px] ${isDarkMode ? 'border-white bg-white text-black hover:bg-neutral-200' : 'border-black bg-black text-white hover:bg-neutral-800'} transition-colors cursor-pointer text-[10px] uppercase font-bold`}
        >
          {isDarkMode ? 'MODE: DARK' : 'MODE: LIGHT'}
        </button>
      </div>
    </header>
  );
};
