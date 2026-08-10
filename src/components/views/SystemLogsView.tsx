import React, { useState, useEffect } from 'react';
import { SystemLog } from '../../types';

interface SystemLogsViewProps {
  isDarkMode: boolean;
}

export const SystemLogsView: React.FC<SystemLogsViewProps> = ({ isDarkMode }) => {
  const [logs, setLogs] = useState<SystemLog[]>([
    { id: '1', timestamp: '09:08:12', level: 'SYS', source: 'INIT', message: 'Stark Minimal theme engine loaded.' },
    { id: '2', timestamp: '09:08:14', level: 'INFO', source: 'VITE', message: 'Vite 6 server listening on port 3000.' },
    { id: '3', timestamp: '09:08:15', level: 'EXEC', source: 'MANIFEST', message: 'Manifest [V.04] parsed 6 root layer definitions.' },
    { id: '4', timestamp: '09:08:20', level: 'INFO', source: 'GEMINI', message: 'Gemini API client initialized.' },
  ]);

  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const newLog: SystemLog = {
        id: Date.now().toString(),
        timestamp: timeStr,
        level: Math.random() > 0.8 ? 'WARN' : 'INFO',
        source: 'RUNTIME',
        message: `Heartbeat check passed. Latency: ${Math.floor(Math.random() * 15 + 5)}ms.`,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const borderClass = isDarkMode ? 'border-white' : 'border-black';

  const filteredLogs = logs.filter((log) => filterLevel === 'ALL' || log.level === filterLevel);

  return (
    <div className="flex-1 p-6 md:p-10 lg:p-14 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono-custom text-xs uppercase tracking-[0.15em] text-neutral-500 font-bold">
            Manifest Layer: system_logs
          </span>
          <span className="font-mono-custom text-xs uppercase tracking-wider text-neutral-400">
            [STREAM: LIVE]
          </span>
        </div>

        <h1 className="font-oswald text-6xl sm:text-8xl md:text-9xl font-bold leading-none tracking-tight uppercase -ml-1">
          Logs
        </h1>

        <p className="font-sans font-light text-sm md:text-lg uppercase tracking-tight mt-2 max-w-xl">
          Real-time Event Stream & Terminal Diagnostic Diagnostics
        </p>
      </div>

      <div className="my-6 space-y-4">
        {/* Log Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono-custom text-xs">
          <div className="flex gap-2">
            {(['ALL', 'INFO', 'WARN', 'SYS', 'EXEC'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1 border-[1.5px] ${borderClass} uppercase font-bold cursor-pointer ${
                  filterLevel === lvl
                    ? isDarkMode
                      ? 'bg-white text-black'
                      : 'bg-black text-white'
                    : 'bg-transparent text-neutral-500'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => setLogs([])}
            className="text-neutral-500 underline hover:font-bold cursor-pointer"
          >
            Clear Stream
          </button>
        </div>

        {/* Terminal Window */}
        <div className={`border-[1.5px] ${borderClass} p-4 font-mono-custom text-xs space-y-2 h-72 overflow-y-auto`}>
          {filteredLogs.length === 0 ? (
            <div className="text-neutral-500 uppercase tracking-wider">No logs recorded for filter.</div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex gap-3 items-start border-b border-neutral-200 dark:border-neutral-800 pb-1">
                <span className="text-neutral-400 font-bold">[{log.timestamp}]</span>
                <span
                  className={`font-bold px-1 text-[10px] uppercase ${
                    log.level === 'WARN'
                      ? 'bg-amber-500 text-black'
                      : log.level === 'SYS'
                      ? 'bg-blue-500 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-800'
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-neutral-500">[{log.source}]</span>
                <span className="flex-1">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
