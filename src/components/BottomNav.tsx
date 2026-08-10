import React from 'react';

interface BottomNavProps {
  isDarkMode: boolean;
  onInitialize: () => void;
  onRunDiagnostics: () => void;
  statusText: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  isDarkMode,
  onInitialize,
  onRunDiagnostics,
  statusText,
}) => {
  const borderClass = isDarkMode ? 'border-white' : 'border-black';
  const buttonClass = isDarkMode
    ? 'bg-white text-black hover:bg-neutral-200'
    : 'bg-black text-white hover:bg-neutral-800';

  const outlineButtonClass = isDarkMode
    ? 'border-white text-white hover:bg-white hover:text-black'
    : 'border-black text-black hover:bg-black hover:text-white';

  return (
    <footer className={`min-h-[90px] border-t-[1.5px] ${borderClass} flex flex-col md:flex-row items-stretch md:items-center justify-between px-6 md:px-10 py-4 gap-4 transition-colors select-none`}>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onInitialize}
          className={`${buttonClass} px-8 py-4 font-sans font-bold text-xs uppercase tracking-[0.1em] transition-all cursor-pointer shadow-none active:translate-y-0.5`}
        >
          Initialize Application
        </button>

        <button
          onClick={onRunDiagnostics}
          className={`border-[1.5px] ${outlineButtonClass} px-6 py-4 font-mono-custom font-bold text-xs uppercase tracking-[0.1em] transition-all cursor-pointer`}
        >
          Run Diagnostics
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-ping"></span>
        <span className="font-mono-custom text-xs uppercase tracking-wider font-medium">
          Status: {statusText}
        </span>
      </div>
    </footer>
  );
};
