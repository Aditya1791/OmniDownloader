import React, { useState, useEffect } from 'react';

interface InitAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const InitAppModal: React.FC<InitAppModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const steps = [
    'Parsing project manifest.json...',
    'Resolving Vite & React 19 dependencies...',
    'Compiling AST nodes and CSS tailwind rules...',
    'Bundling production artifacts to /dist...',
    'Service deployed to Cloud Run on port 3000.',
  ];

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setLogs(['> INITIALIZE_APPLICATION sequence triggered.']);

      const timer1 = setTimeout(() => {
        setStep(1);
        setLogs((prev) => [...prev, '> ' + steps[0]]);
      }, 500);

      const timer2 = setTimeout(() => {
        setStep(2);
        setLogs((prev) => [...prev, '> ' + steps[1]]);
      }, 1200);

      const timer3 = setTimeout(() => {
        setStep(3);
        setLogs((prev) => [...prev, '> ' + steps[2]]);
      }, 2000);

      const timer4 = setTimeout(() => {
        setStep(4);
        setLogs((prev) => [...prev, '> ' + steps[3]]);
      }, 2800);

      const timer5 = setTimeout(() => {
        setStep(5);
        setLogs((prev) => [...prev, '> ' + steps[4], '> SUCCESS: BUILD_COMPLETE [0.00s errors]']);
      }, 3500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const borderClass = isDarkMode ? 'border-white' : 'border-black';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-2xl border-[1.5px] ${borderClass} ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} p-6 md:p-8 space-y-6 shadow-2xl`}>
        <div className="flex justify-between items-center border-b-[1.5px] border-current pb-4">
          <span className="font-mono-custom text-xs font-bold uppercase tracking-widest">
            INITIALIZE_APPLICATION_SEQUENCE
          </span>
          <button
            onClick={onClose}
            className="font-mono-custom text-xs font-bold uppercase hover:underline cursor-pointer"
          >
            [CLOSE]
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between font-mono-custom text-xs">
            <span>COMPILATION PROGRESS</span>
            <span>{Math.min(Math.round((step / 5) * 100), 100)}%</span>
          </div>
          <div className={`w-full h-3 border-[1.5px] ${borderClass} p-0.5`}>
            <div
              className={`h-full ${isDarkMode ? 'bg-white' : 'bg-black'} transition-all duration-300`}
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Console Log */}
        <div className={`border-[1.5px] ${borderClass} p-4 font-mono-custom text-xs space-y-1 h-48 overflow-y-auto`}>
          {logs.map((log, i) => (
            <div key={i} className="text-neutral-600 dark:text-neutral-300">
              {log}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            disabled={step < 5}
            className={`px-8 py-3 border-[1.5px] ${borderClass} ${
              isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
            } font-sans font-bold text-xs uppercase tracking-widest cursor-pointer disabled:opacity-40`}
          >
            {step < 5 ? 'COMPILING...' : 'COMPLETE & CONTINUE'}
          </button>
        </div>
      </div>
    </div>
  );
};
