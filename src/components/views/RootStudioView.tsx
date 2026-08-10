import React, { useState, useEffect, useRef } from 'react';
import { ManifestKey } from '../../types';
import { Video, Music, Film, ChevronDown, Check, Clipboard, ClipboardCheck, Link2, Sparkles, Zap, Sliders, ShieldCheck } from 'lucide-react';

interface RootStudioViewProps {
  isDarkMode: boolean;
  onSelectView: (view: ManifestKey) => void;
  onInitializeApp: () => void;
  refCode: string;
}

export type ExportFormat = 'MP4' | 'MP3' | 'WebM';

interface FormatConfig {
  id: ExportFormat;
  label: string;
  ext: string;
  category: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ReactNode;
}

interface DownloadJob {
  filename: string;
  sizeMb: number;
}

export const RootStudioView: React.FC<RootStudioViewProps> = ({
  isDarkMode,
  onSelectView,
  onInitializeApp,
  refCode,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentActions, setRecentActions] = useState<string[]>([
    'System initialization sequence mapped.',
    'Directory Workspace_Main indexed.',
    'DOM tree root_div mounted.',
  ]);

  // Format selection state
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('MP4');
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [pasteStatus, setPasteStatus] = useState<string | null>(null);

  // Auto-Detect Quality & Resolution State
  const [autoDetectQuality, setAutoDetectQuality] = useState<boolean>(true);
  const [manualResolution, setManualResolution] = useState<string>('2160p 4K (Ultra HD)');

  // Download Job State
  const downloadPayloads: DownloadJob[] = [
    { filename: 'ASSETS_BUNDLE_V4', sizeMb: 48.2 },
    { filename: 'GEMINI_WEIGHTS_QUANT', sizeMb: 124.5 },
    { filename: 'WORKSPACE_MANIFEST_LOGS', sizeMb: 18.7 },
  ];

  const [selectedJob, setSelectedJob] = useState<DownloadJob>(downloadPayloads[0]);

  // Helper function to resolve optimal quality metadata based on format, job, and prompt URL
  const resolveTargetQuality = (fmt: ExportFormat, urlOrJob: string) => {
    if (fmt === 'MP3') {
      return {
        resolution: '320 kbps (Lossless Master)',
        badge: '320K AUDIO',
        sourceMeta: '44.1kHz • 24-bit Stereo • AAC/MP3 Stream',
        codec: 'Audio / 320kbps',
      };
    }
    if (fmt === 'WebM') {
      return {
        resolution: '4320p 8K (60fps HDR)',
        badge: '8K ULTRA',
        sourceMeta: '7680x4320 • VP9 / Opus • Bitrate: ~65 Mbps',
        codec: 'VP9.2 / Opus',
      };
    }
    if (urlOrJob.toLowerCase().includes('raw_video') || urlOrJob.includes('ASSETS_BUNDLE') || urlOrJob.includes('4k')) {
      return {
        resolution: '2160p 4K (60fps HDR10)',
        badge: '4K UHD',
        sourceMeta: '3840x2160 • H.264/HEVC • Bitrate: ~42 Mbps',
        codec: 'H.264 Main10',
      };
    }
    return {
      resolution: '1080p FHD (60fps High Bitrate)',
      badge: '1080p FHD',
      sourceMeta: '1920x1080 • H.264 High Profile • Bitrate: ~18 Mbps',
      codec: 'H.264 / AAC',
    };
  };

  const activeQuality = autoDetectQuality
    ? resolveTargetQuality(selectedFormat, prompt || selectedJob.filename)
    : {
        resolution: manualResolution,
        badge: manualResolution.split(' ')[0] || 'MANUAL',
        sourceMeta: `User forced target: ${manualResolution}`,
        codec: selectedFormat === 'MP3' ? 'MP3 Audio' : 'H.264 / AAC',
      };

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().length > 0) {
          setPrompt(text);
          setPasteStatus('PASTED!');
          setTimeout(() => setPasteStatus(null), 2000);
          setRecentActions((prev) => [
            `PASTED LINK/COMMAND: "${text.slice(0, 45)}${text.length > 45 ? '...' : ''}"`,
            ...prev,
          ]);
        } else {
          setPasteStatus('CLIPBOARD EMPTY');
          setTimeout(() => setPasteStatus(null), 2000);
        }
      } else {
        setPasteStatus('NOT SUPPORTED');
        setTimeout(() => setPasteStatus(null), 2000);
      }
    } catch {
      setPasteStatus('PASTE DENIED');
      setTimeout(() => setPasteStatus(null), 2000);
    }
  };

  const formatConfigs: Record<ExportFormat, FormatConfig> = {
    MP4: {
      id: 'MP4',
      label: 'MP4 Video',
      ext: '.mp4',
      category: 'H.264 / AAC',
      badgeBg: 'bg-blue-600 dark:bg-blue-500',
      badgeText: 'text-white',
      icon: <Video className="w-3.5 h-3.5" />,
    },
    MP3: {
      id: 'MP3',
      label: 'MP3 Audio',
      ext: '.mp3',
      category: 'Audio 320kbps',
      badgeBg: 'bg-emerald-600 dark:bg-emerald-500',
      badgeText: 'text-white',
      icon: <Music className="w-3.5 h-3.5" />,
    },
    WebM: {
      id: 'WebM',
      label: 'WebM Video',
      ext: '.webm',
      category: 'VP9 / Opus',
      badgeBg: 'bg-purple-600 dark:bg-purple-500',
      badgeText: 'text-white',
      icon: <Film className="w-3.5 h-3.5" />,
    },
  };

  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadStatus, setDownloadStatus] = useState<'IDLE' | 'DOWNLOADING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'>('IDLE');
  const [transferSpeed, setTransferSpeed] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (downloadStatus === 'DOWNLOADING') {
      timerRef.current = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            if (timerRef.current) clearInterval(timerRef.current);
            setDownloadStatus('COMPLETED');
            setTransferSpeed(0);
            const currentExt = formatConfigs[selectedFormat].ext;
            setRecentActions((actions) => [
              `DOWNLOAD COMPLETE: ${selectedJob.filename}${currentExt} (${selectedJob.sizeMb} MB) [${selectedFormat} | ${activeQuality.resolution}]`,
              ...actions,
            ]);
            return 100;
          }
          // Simulate dynamic bandwidth variation
          const increment = Math.random() * 8 + 3;
          const currentSpeed = (increment * (selectedJob.sizeMb / 100) * 10).toFixed(1);
          setTransferSpeed(parseFloat(currentSpeed));
          return Math.min(prev + increment, 100);
        });
      }, 300);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [downloadStatus, selectedJob, selectedFormat, activeQuality.resolution]);

  const startDownload = () => {
    if (downloadStatus === 'COMPLETED' || downloadStatus === 'CANCELLED') {
      setDownloadProgress(0);
    }
    setDownloadStatus('DOWNLOADING');
    const currentExt = formatConfigs[selectedFormat].ext;
    setRecentActions((prev) => [
      `TRIGGERED DOWNLOAD: ${selectedJob.filename}${currentExt} (${selectedJob.sizeMb} MB) [FORMAT: ${selectedFormat} | RESOLUTION: ${activeQuality.resolution}]`,
      ...prev,
    ]);
  };

  const pauseDownload = () => {
    setDownloadStatus('PAUSED');
  };

  const cancelDownload = () => {
    setDownloadStatus('CANCELLED');
    setDownloadProgress(0);
    setTransferSpeed(0);
    const currentExt = formatConfigs[selectedFormat].ext;
    setRecentActions((prev) => [
      `CANCELLED DOWNLOAD: ${selectedJob.filename}${currentExt}`,
      ...prev,
    ]);
  };

  const resetDownload = () => {
    setDownloadStatus('IDLE');
    setDownloadProgress(0);
    setTransferSpeed(0);
  };

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsProcessing(true);
    const newPrompt = prompt;
    setPrompt('');

    setTimeout(() => {
      setRecentActions((prev) => [
        `Executed: "${newPrompt}"`,
        `Compiled AST node [${Math.floor(Math.random() * 9000 + 1000)}]`,
        ...prev,
      ]);
      setIsProcessing(false);
    }, 600);
  };

  const borderClass = isDarkMode ? 'border-white' : 'border-black';

  const downloadedMb = ((downloadProgress / 100) * selectedJob.sizeMb).toFixed(1);
  const remainingSeconds = transferSpeed > 0 
    ? (((selectedJob.sizeMb - parseFloat(downloadedMb)) / transferSpeed)).toFixed(1) 
    : '0.0';

  const activeFormat = formatConfigs[selectedFormat];
  const activeFilename = `${selectedJob.filename}${activeFormat.ext}`;

  return (
    <div className="flex-1 p-6 md:p-10 lg:p-14 flex flex-col justify-between overflow-y-auto">
      {/* Top Header Label & Title */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono-custom text-xs uppercase tracking-[0.15em] text-neutral-500 font-bold">
            Ref. {refCode}
          </span>
          <span className="font-mono-custom text-xs uppercase tracking-wider text-neutral-400">
            [MODE: STARK_MINIMAL]
          </span>
        </div>

        <h1 className="font-oswald text-7xl sm:text-9xl md:text-[11rem] lg:text-[14rem] font-bold leading-none tracking-tight uppercase -ml-1 sm:-ml-2 select-none">
          Studio
        </h1>

        <p className="font-sans font-light text-base md:text-xl uppercase tracking-tight mt-2 max-w-xl">
          Automated Interface Rendering Environment
        </p>
      </div>

      {/* Main Interactive Command & Download Console */}
      <div className="my-8 md:my-12 space-y-6">
        {/* Real-time Download Progress Bar Component */}
        <div className={`border-[1.5px] ${borderClass} p-5 space-y-4 relative`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-[1.5px] border-current pb-3">
            <span className="font-mono-custom text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                downloadStatus === 'DOWNLOADING' ? 'bg-emerald-500 animate-pulse' :
                downloadStatus === 'COMPLETED' ? 'bg-blue-500' :
                downloadStatus === 'PAUSED' ? 'bg-amber-500' : 'bg-neutral-400'
              }`} />
              01. Real-time Download Job Streamer
            </span>
            <span className="font-mono-custom text-xs uppercase tracking-wider font-bold">
              STATUS: [{downloadStatus}]
            </span>
          </div>

          {/* Job & Format & Quality Selection Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* Payload Selector */}
            <div className="md:col-span-4">
              <label className="font-mono-custom text-[10px] uppercase text-neutral-500 block mb-1">
                Select Asset Payload
              </label>
              <select
                disabled={downloadStatus === 'DOWNLOADING'}
                value={selectedJob.filename}
                onChange={(e) => {
                  const job = downloadPayloads.find((j) => j.filename === e.target.value);
                  if (job) {
                    setSelectedJob(job);
                    resetDownload();
                  }
                }}
                className={`w-full p-2 border-[1.5px] ${borderClass} bg-transparent font-mono-custom text-xs uppercase tracking-wider outline-none cursor-pointer disabled:opacity-50 h-[38px]`}
              >
                {downloadPayloads.map((job) => (
                  <option key={job.filename} value={job.filename} className={isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>
                    {job.filename} ({job.sizeMb} MB)
                  </option>
                ))}
              </select>
            </div>

            {/* Export Format Selector with Badges */}
            <div className="md:col-span-4 relative">
              <label className="font-mono-custom text-[10px] uppercase text-neutral-500 block mb-1">
                Target Export Format
              </label>
              <button
                type="button"
                disabled={downloadStatus === 'DOWNLOADING'}
                onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)}
                className={`w-full p-2 border-[1.5px] ${borderClass} bg-transparent font-mono-custom text-xs uppercase tracking-wider outline-none cursor-pointer flex items-center justify-between disabled:opacity-50 select-none h-[38px]`}
              >
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider ${activeFormat.badgeBg} ${activeFormat.badgeText}`}>
                    {activeFormat.icon}
                    {activeFormat.id}
                  </span>
                  <span className="text-[11px] text-neutral-500 hidden sm:inline">
                    {activeFormat.category}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFormatDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Custom Format Dropdown Menu */}
              {isFormatDropdownOpen && (
                <div className={`absolute left-0 right-0 top-full mt-1 z-30 border-[1.5px] ${borderClass} ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} shadow-2xl p-1 space-y-1`}>
                  {(Object.keys(formatConfigs) as ExportFormat[]).map((fmtKey) => {
                    const fmt = formatConfigs[fmtKey];
                    const isSelected = selectedFormat === fmtKey;
                    return (
                      <button
                        key={fmtKey}
                        type="button"
                        onClick={() => {
                          setSelectedFormat(fmtKey);
                          setIsFormatDropdownOpen(false);
                          if (downloadStatus === 'COMPLETED' || downloadStatus === 'CANCELLED') {
                            resetDownload();
                          }
                        }}
                        className={`w-full p-2 text-left font-mono-custom text-xs flex items-center justify-between transition-colors cursor-pointer border-[1.5px] ${
                          isSelected
                            ? isDarkMode
                              ? 'border-white bg-neutral-900'
                              : 'border-black bg-neutral-100'
                            : 'border-transparent hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider ${fmt.badgeBg} ${fmt.badgeText}`}>
                            {fmt.icon}
                            {fmt.id}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs">{fmt.label}</span>
                            <span className="text-[10px] text-neutral-500">{fmt.category}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Auto-Detect Quality Control */}
            <div className="md:col-span-4">
              <div className="flex items-center justify-between mb-1">
                <label className="font-mono-custom text-[10px] uppercase text-neutral-500 block">
                  Quality Resolution
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !autoDetectQuality;
                    setAutoDetectQuality(nextVal);
                    setRecentActions((prev) => [
                      `AUTO-DETECT QUALITY: ${nextVal ? 'ENABLED (Auto highest metadata)' : 'DISABLED (Manual selection)'}`,
                      ...prev,
                    ]);
                  }}
                  className={`font-mono-custom text-[9px] font-bold px-2 py-0.5 border-[1.5px] ${borderClass} flex items-center gap-1 cursor-pointer transition-colors ${
                    autoDetectQuality
                      ? 'bg-amber-500 text-black border-amber-500'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>AUTO-DETECT: {autoDetectQuality ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {autoDetectQuality ? (
                <div className={`p-2 border-[1.5px] ${borderClass} bg-neutral-100 dark:bg-neutral-900 flex items-center justify-between text-xs font-mono-custom h-[38px]`}>
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="px-1.5 py-0.5 bg-amber-500 text-black text-[9px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" />
                      AUTO
                    </span>
                    <span className="font-bold truncate text-[11px]">{activeQuality.resolution}</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ) : (
                <select
                  value={manualResolution}
                  disabled={downloadStatus === 'DOWNLOADING'}
                  onChange={(e) => {
                    setManualResolution(e.target.value);
                    setRecentActions((prev) => [
                      `MANUAL RESOLUTION SET: ${e.target.value}`,
                      ...prev,
                    ]);
                  }}
                  className={`w-full p-2 border-[1.5px] ${borderClass} bg-transparent font-mono-custom text-xs uppercase tracking-wider outline-none cursor-pointer h-[38px]`}
                >
                  {selectedFormat === 'MP3' ? (
                    <>
                      <option value="320 kbps (Lossless Master)" className={isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>320 kbps (Lossless Master)</option>
                      <option value="256 kbps (VBR High)" className={isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>256 kbps (VBR High)</option>
                      <option value="192 kbps (Standard)" className={isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>192 kbps (Standard)</option>
                      <option value="128 kbps (Compact)" className={isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>128 kbps (Compact)</option>
                    </>
                  ) : (
                    <>
                      <option value="4320p 8K (Extreme)" className={isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>4320p 8K (Extreme)</option>
                      <option value="2160p 4K (Ultra HD)" className={isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>2160p 4K (Ultra HD)</option>
                      <option value="1440p 2K (Quad HD)" className={isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>1440p 2K (Quad HD)</option>
                      <option value="1080p FHD (Full HD)" className={isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>1080p FHD (Full HD)</option>
                      <option value="720p HD" className={isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>720p HD</option>
                      <option value="480p SD" className={isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>480p SD</option>
                    </>
                  )}
                </select>
              )}
            </div>
          </div>

          {/* Download Execution Actions Row */}
          <div className="pt-1 flex items-center justify-end">
            <div className="w-full sm:w-auto min-w-[220px]">
              {downloadStatus === 'IDLE' && (
                <button
                  onClick={startDownload}
                  className={`w-full py-2.5 px-6 border-[1.5px] ${borderClass} ${
                    isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
                  } font-sans font-bold text-xs uppercase tracking-widest cursor-pointer hover:opacity-90 transition-opacity`}
                >
                  START DOWNLOAD
                </button>
              )}

              {downloadStatus === 'DOWNLOADING' && (
                <div className="flex gap-2 w-full">
                  <button
                    onClick={pauseDownload}
                    className={`flex-1 py-2.5 border-[1.5px] ${borderClass} font-mono-custom font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-neutral-800 hover:text-white dark:hover:bg-neutral-200 dark:hover:text-black`}
                  >
                    PAUSE
                  </button>
                  <button
                    onClick={cancelDownload}
                    className={`px-4 py-2.5 border-[1.5px] ${borderClass} font-mono-custom font-bold text-xs uppercase tracking-wider cursor-pointer bg-red-600 text-white border-red-600 hover:bg-red-700`}
                  >
                    CANCEL
                  </button>
                </div>
              )}

              {downloadStatus === 'PAUSED' && (
                <div className="flex gap-2 w-full">
                  <button
                    onClick={startDownload}
                    className={`flex-1 py-2.5 border-[1.5px] ${borderClass} ${
                      isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
                    } font-sans font-bold text-xs uppercase tracking-widest cursor-pointer`}
                  >
                    RESUME
                  </button>
                  <button
                    onClick={cancelDownload}
                    className={`px-4 py-2.5 border-[1.5px] ${borderClass} font-mono-custom font-bold text-xs uppercase tracking-wider cursor-pointer`}
                  >
                    CANCEL
                  </button>
                </div>
              )}

              {(downloadStatus === 'COMPLETED' || downloadStatus === 'CANCELLED') && (
                <button
                  onClick={resetDownload}
                  className={`w-full py-2.5 px-6 border-[1.5px] ${borderClass} font-mono-custom font-bold text-xs uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black`}
                >
                  RESET JOB
                </button>
              )}
            </div>
          </div>

          {/* Target File & Source Quality Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-custom bg-neutral-100 dark:bg-neutral-900 p-2.5 border-[1.5px] border-current">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 text-[10px] uppercase font-bold">ACTIVE TARGET:</span>
              <span className="font-bold tracking-wider flex items-center gap-1.5">
                <span>{activeFilename}</span>
                <span className={`px-1.5 py-0.2 text-[9px] font-bold ${activeFormat.badgeBg} ${activeFormat.badgeText}`}>
                  {activeFormat.id}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-neutral-500 border-t sm:border-t-0 sm:border-l border-current pt-1 sm:pt-0 sm:pl-3">
              <span className="font-bold text-current flex items-center gap-1">
                {autoDetectQuality && <Sparkles className="w-3 h-3 text-amber-500" />}
                {activeQuality.resolution}
              </span>
              <span className="hidden md:inline">• {activeQuality.sourceMeta}</span>
            </div>
          </div>

          {/* Progress Bar Display */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-baseline font-mono-custom text-xs">
              <span className="font-bold uppercase tracking-wider">
                {downloadedMb} / {selectedJob.sizeMb} MB
              </span>
              <span className="font-oswald text-xl font-bold">
                {downloadProgress.toFixed(1)}%
              </span>
            </div>

            {/* Stark Monochromatic Bar Outer Frame */}
            <div className={`w-full h-4 border-[1.5px] ${borderClass} p-0.5 bg-transparent overflow-hidden relative`}>
              <div
                className={`h-full ${
                  isDarkMode ? 'bg-white' : 'bg-black'
                } transition-all duration-300 ease-out`}
                style={{ width: `${downloadProgress}%` }}
              />
            </div>

            {/* Metrics Footer */}
            <div className="grid grid-cols-3 gap-2 font-mono-custom text-[11px] text-neutral-500 pt-1 border-t border-dashed border-current">
              <div>
                SPEED: <span className="text-current font-bold">{transferSpeed} MB/S</span>
              </div>
              <div className="text-center">
                ETA: <span className="text-current font-bold">{downloadStatus === 'DOWNLOADING' ? `${remainingSeconds}S` : '--'}</span>
              </div>
              <div className="text-right">
                FORMAT: <span className="text-current font-bold uppercase">{selectedFormat}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Command Form with Paste Button */}
        <form onSubmit={handleRunCommand} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className={`flex-1 border-[1.5px] ${borderClass} flex items-center px-4 py-2 bg-transparent gap-2`}>
              <span className="font-mono-custom text-sm font-bold text-neutral-400">$&gt;</span>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="PASTE MEDIA URL OR COMMAND (e.g. https://media.stream/v/892)..."
                className="w-full bg-transparent font-mono-custom text-xs sm:text-sm uppercase tracking-wider outline-none placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                title="Paste URL or prompt from Clipboard"
                className={`px-3 py-1.5 border-[1.5px] ${borderClass} font-mono-custom text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  pasteStatus === 'PASTED!'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : isDarkMode
                    ? 'hover:bg-white hover:text-black'
                    : 'hover:bg-black hover:text-white'
                } transition-colors`}
              >
                {pasteStatus === 'PASTED!' ? (
                  <ClipboardCheck className="w-3.5 h-3.5" />
                ) : (
                  <Clipboard className="w-3.5 h-3.5" />
                )}
                <span>{pasteStatus || 'PASTE URL'}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`px-8 py-3 border-[1.5px] ${
                isDarkMode ? 'bg-white text-black border-white hover:bg-neutral-200' : 'bg-black text-white border-black hover:bg-neutral-800'
              } font-sans font-bold text-xs uppercase tracking-widest cursor-pointer disabled:opacity-50`}
            >
              {isProcessing ? 'PROCESSING...' : 'EXECUTE'}
            </button>
          </div>
        </form>

        {/* Quick Action Presets & Sample Media Links */}
        <div className="flex flex-wrap gap-2 text-xs font-mono-custom items-center">
          <span className="text-neutral-500 uppercase py-1">PRESETS:</span>
          {[
            { label: 'RENDER VIEWPORT', view: 'viewport_layer' as ManifestKey },
            { label: 'RESOURCE GRID', view: 'control_grid' as ManifestKey },
            { label: 'TYPOGRAPHY SPECS', view: 'style_definition' as ManifestKey },
            { label: 'GEMINI AI ENGINE', view: 'gemini_agent' as ManifestKey },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => onSelectView(preset.view)}
              className={`border-[1.5px] ${borderClass} px-3 py-1 font-semibold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer text-[11px]`}
            >
              → {preset.label}
            </button>
          ))}

          <span className="text-neutral-500 uppercase py-1 ml-2">SAMPLE LINKS:</span>
          {[
            'https://stream.net/raw_video.mp4',
            'https://audio.cdn/master_track.mp3',
            'https://webm.org/matrix_spec.webm',
          ].map((url) => (
            <button
              key={url}
              onClick={() => {
                setPrompt(url);
                setRecentActions((prev) => [`LOADED SAMPLE LINK: ${url}`, ...prev]);
              }}
              className={`border-[1.5px] ${borderClass} px-2.5 py-1 text-[10px] font-mono-custom flex items-center gap-1.5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer`}
            >
              <Link2 className="w-3 h-3 text-neutral-400" />
              <span>{url.split('/').pop()}</span>
            </button>
          ))}
        </div>

        {/* Execution Stream Log Box */}
        <div className={`border-[1.5px] ${borderClass} p-4 font-mono-custom text-xs space-y-1.5 max-h-40 overflow-y-auto`}>
          <div className="text-neutral-500 text-[10px] uppercase tracking-widest mb-2 pb-1 border-b-[1.5px] border-current">
            LIVE SYSTEM COMMAND HISTORY
          </div>
          {recentActions.map((act, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-neutral-400 font-bold">[{idx + 1}]</span>
              <span>{act}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


