import React from 'react';
import { ManifestKey, ManifestItem } from '../types';

interface SideColProps {
  activeView: ManifestKey;
  onSelectView: (view: ManifestKey) => void;
  manifestItems: ManifestItem[];
  isDarkMode: boolean;
  onOpenManifestModal: () => void;
}

export const SideCol: React.FC<SideColProps> = ({
  activeView,
  onSelectView,
  manifestItems,
  isDarkMode,
  onOpenManifestModal,
}) => {
  return (
    <aside className={`w-full lg:w-72 xl:w-80 border-b-[1.5px] lg:border-b-0 lg:border-r-[1.5px] ${isDarkMode ? 'border-white bg-black text-white' : 'border-black bg-white text-black'} p-6 md:p-8 lg:p-10 flex flex-col justify-between shrink-0 transition-colors duration-200 select-none`}>
      {/* Manifest Section */}
      <div>
        <div className="flex justify-between items-baseline mb-6">
          <span className="font-mono-custom text-[11px] uppercase tracking-[0.15em] block text-neutral-500 font-semibold">
            Manifest [V.04]
          </span>
          <button
            onClick={onOpenManifestModal}
            className="font-mono-custom text-[10px] underline uppercase cursor-pointer hover:font-bold"
          >
            Raw JSON
          </button>
        </div>

        <nav className="space-y-3">
          {manifestItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full text-left font-mono-custom text-xs tracking-wider transition-all duration-150 flex items-center p-2 border-[1.5px] cursor-pointer ${
                  isActive
                    ? isDarkMode
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-black text-white border-black font-bold'
                    : isDarkMode
                    ? 'border-transparent text-neutral-300 hover:border-neutral-700 hover:text-white'
                    : 'border-transparent text-neutral-700 hover:border-neutral-300 hover:text-black'
                }`}
              >
                <span className="mr-3 font-bold">{isActive ? '→' : ' '}</span>
                <span>{item.id}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Section */}
      <div className="pt-8 mt-8 border-t-[1.5px] border-current space-y-6">
        <div>
          <span className="font-mono-custom text-[10px] uppercase tracking-[0.15em] text-neutral-500 block mb-1">
            System Version
          </span>
          <p className="font-sans font-bold text-sm tracking-tight">4.3.3 Build 892</p>
        </div>

        <div>
          <span className="font-mono-custom text-[10px] uppercase tracking-[0.15em] text-neutral-500 block mb-1">
            Date Logged
          </span>
          <p className="font-sans font-bold text-sm tracking-tight">AUG 09 2026</p>
        </div>

        <div>
          <span className="font-mono-custom text-[10px] uppercase tracking-[0.15em] text-neutral-500 block mb-1">
            Runtime Engine
          </span>
          <p className="font-mono-custom text-xs font-semibold">React 19 + Vite 6</p>
        </div>
      </div>
    </aside>
  );
};
