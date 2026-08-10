import React, { useState } from 'react';
import { SystemMetrics } from '../../types';

interface ControlGridProps {
  metrics: SystemMetrics;
  onUpdateMetrics: (updater: (prev: SystemMetrics) => SystemMetrics) => void;
  isDarkMode: boolean;
}

export const ControlGrid: React.FC<ControlGridProps> = ({
  metrics,
  onUpdateMetrics,
  isDarkMode,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<'ECO' | 'STANDARD' | 'TURBO' | 'OVERCLOCK'>('STANDARD');

  const borderClass = isDarkMode ? 'border-white' : 'border-black';

  const applyProfile = (profile: 'ECO' | 'STANDARD' | 'TURBO' | 'OVERCLOCK') => {
    setSelectedProfile(profile);
    if (profile === 'ECO') {
      onUpdateMetrics((prev) => ({ ...prev, loadCapacity: 1.2, activeThreads: 4, latencyMs: 24, fps: 60 }));
    } else if (profile === 'STANDARD') {
      onUpdateMetrics((prev) => ({ ...prev, loadCapacity: 2.4, activeThreads: 12, latencyMs: 14, fps: 60 }));
    } else if (profile === 'TURBO') {
      onUpdateMetrics((prev) => ({ ...prev, loadCapacity: 18.5, activeThreads: 16, latencyMs: 8, fps: 120 }));
    } else {
      onUpdateMetrics((prev) => ({ ...prev, loadCapacity: 64.0, activeThreads: 16, latencyMs: 3, fps: 144 }));
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 lg:p-14 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono-custom text-xs uppercase tracking-[0.15em] text-neutral-500 font-bold">
            Manifest Layer: control_grid
          </span>
          <span className="font-mono-custom text-xs uppercase tracking-wider text-neutral-400">
            [PROFILES: READY]
          </span>
        </div>

        <h1 className="font-oswald text-6xl sm:text-8xl md:text-9xl font-bold leading-none tracking-tight uppercase -ml-1">
          Control
        </h1>

        <p className="font-sans font-light text-sm md:text-lg uppercase tracking-tight mt-2 max-w-xl">
          System Performance, Thread Allocation & Resource Diagnostics
        </p>
      </div>

      {/* Control Profile Switcher */}
      <div className="my-6 space-y-6">
        <div>
          <span className="font-mono-custom text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-3">
            01. Performance Profile
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['ECO', 'STANDARD', 'TURBO', 'OVERCLOCK'] as const).map((prof) => (
              <button
                key={prof}
                onClick={() => applyProfile(prof)}
                className={`p-4 border-[1.5px] ${borderClass} font-mono-custom text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                  selectedProfile === prof
                    ? isDarkMode
                      ? 'bg-white text-black'
                      : 'bg-black text-white'
                    : 'bg-transparent hover:border-neutral-400'
                }`}
              >
                {prof}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`border-[1.5px] ${borderClass} p-6 space-y-3`}>
            <div className="flex justify-between items-center">
              <span className="font-mono-custom text-xs font-bold uppercase tracking-wider">
                Load Capacity
              </span>
              <span className="font-oswald text-2xl font-bold">{metrics.loadCapacity.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="100"
              step="0.1"
              value={metrics.loadCapacity}
              onChange={(e) =>
                onUpdateMetrics((prev) => ({ ...prev, loadCapacity: parseFloat(e.target.value) }))
              }
              className="w-full accent-black dark:accent-white cursor-pointer"
            />
          </div>

          <div className={`border-[1.5px] ${borderClass} p-6 space-y-3`}>
            <div className="flex justify-between items-center">
              <span className="font-mono-custom text-xs font-bold uppercase tracking-wider">
                Active Threads
              </span>
              <span className="font-oswald text-2xl font-bold">
                {metrics.activeThreads} / {metrics.totalThreads}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max={metrics.totalThreads}
              value={metrics.activeThreads}
              onChange={(e) =>
                onUpdateMetrics((prev) => ({ ...prev, activeThreads: parseInt(e.target.value) }))
              }
              className="w-full accent-black dark:accent-white cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
