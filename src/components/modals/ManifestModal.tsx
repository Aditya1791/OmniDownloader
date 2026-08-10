import React, { useState } from 'react';
import { ManifestItem } from '../../types';

interface ManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  manifestItems: ManifestItem[];
  isDarkMode: boolean;
}

export const ManifestModal: React.FC<ManifestModalProps> = ({
  isOpen,
  onClose,
  manifestItems,
  isDarkMode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(
    {
      manifest_version: '04',
      system: 'Stark Minimal AI Studio',
      layers: manifestItems,
      date_logged: '2026-08-09',
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const borderClass = isDarkMode ? 'border-white' : 'border-black';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-2xl border-[1.5px] ${borderClass} ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} p-6 md:p-8 space-y-6 shadow-2xl`}>
        <div className="flex justify-between items-center border-b-[1.5px] border-current pb-4">
          <span className="font-mono-custom text-xs font-bold uppercase tracking-widest">
            RAW_JSON_MANIFEST [V.04]
          </span>
          <button
            onClick={onClose}
            className="font-mono-custom text-xs font-bold uppercase hover:underline cursor-pointer"
          >
            [CLOSE]
          </button>
        </div>

        <div className={`border-[1.5px] ${borderClass} p-4 font-mono-custom text-xs max-h-72 overflow-y-auto`}>
          <pre className="whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">{jsonString}</pre>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={handleCopy}
            className={`px-6 py-3 border-[1.5px] ${borderClass} font-mono-custom font-bold text-xs uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors`}
          >
            {copied ? 'COPIED TO CLIPBOARD' : 'COPY MANIFEST JSON'}
          </button>
          <button
            onClick={onClose}
            className={`px-8 py-3 border-[1.5px] ${borderClass} ${
              isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
            } font-sans font-bold text-xs uppercase tracking-widest cursor-pointer`}
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
