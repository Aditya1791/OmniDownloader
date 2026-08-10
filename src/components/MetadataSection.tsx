import React from 'react';
import { SystemMetrics } from '../types';

interface MetadataSectionProps {
  metrics: SystemMetrics;
  isDarkMode: boolean;
  onOpenLoadSimulator: () => void;
}

export const MetadataSection: React.FC<MetadataSectionProps> = ({
  metrics,
  isDarkMode,
  onOpenLoadSimulator,
}) => {
  const borderClass = isDarkMode ? 'border-white' : 'border-black';

  return (
    <div className={`border-t-[1.5px] ${borderClass} grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 select-none`}>
      {/* Meta Cell 1: Load Capacity */}
      <div
        onClick={onOpenLoadSimulator}
        className={`p-6 lg:p-8 border-b-[1.5px] sm:border-b-0 sm:border-r-[1.5px] ${borderClass} cursor-pointer group hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono-custom text-[10px] uppercase tracking-[0.15em] text-neutral-500">
            Load Capacity
          </span>
          <span className="font-mono-custom text-[10px] underline group-hover:font-bold">
            Simulate ⚙
          </span>
        </div>
        <div className="font-oswald text-4xl lg:text-5xl font-medium tracking-tight">
          {metrics.loadCapacity.toFixed(1)}%
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 mt-3 overflow-hidden">
          <div
            className={`h-full ${isDarkMode ? 'bg-white' : 'bg-black'} transition-all duration-300`}
            style={{ width: `${Math.min(metrics.loadCapacity, 100)}%` }}
          />
        </div>
      </div>

      {/* Meta Cell 2: Integrated Stack */}
      <div className={`p-6 lg:p-8 border-b-[1.5px] sm:border-b-0 xl:border-r-[1.5px] ${borderClass}`}>
        <span className="font-mono-custom text-[10px] uppercase tracking-[0.15em] text-neutral-500 block mb-2">
          Integrated Stack
        </span>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
          <span className="font-mono-custom text-xs underline font-bold">HTML5</span>
          <span className="font-mono-custom text-xs underline font-bold">CSS4</span>
          <span className="font-mono-custom text-xs underline font-bold">REACT19</span>
          <span className="font-mono-custom text-xs underline font-bold">GEMINI2.5</span>
        </div>
      </div>

      {/* Meta Cell 3: Active Threads */}
      <div className={`p-6 lg:p-8 border-b-[1.5px] sm:border-b-0 sm:border-r-[1.5px] ${borderClass}`}>
        <span className="font-mono-custom text-[10px] uppercase tracking-[0.15em] text-neutral-500 block mb-2">
          Active Threads
        </span>
        <div className="font-oswald text-4xl lg:text-5xl font-medium tracking-tight">
          {metrics.activeThreads} <span className="text-2xl text-neutral-400">/ {metrics.totalThreads}</span>
        </div>
      </div>

      {/* Meta Cell 4: System Latency */}
      <div className="p-6 lg:p-8">
        <span className="font-mono-custom text-[10px] uppercase tracking-[0.15em] text-neutral-500 block mb-2">
          Engine Latency
        </span>
        <div className="font-oswald text-4xl lg:text-5xl font-medium tracking-tight">
          {metrics.latencyMs} <span className="text-xl">MS</span>
        </div>
      </div>
    </div>
  );
};
