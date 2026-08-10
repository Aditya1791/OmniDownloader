export type ExportFormat = 'MP4' | 'MP3' | 'WebM' | 'FLAC' | 'M4A';

export type MediaResolution = 
  | '4320p 8K (Extreme HDR)'
  | '2160p 4K (Ultra HD 60fps)'
  | '1440p 2K (Quad HD)'
  | '1080p FHD (High Bitrate 60fps)'
  | '720p HD (Fast)'
  | '480p SD'
  | '320 kbps (Lossless Master)'
  | '256 kbps (High Fidelity)'
  | '192 kbps (Standard)'
  | '128 kbps (Compact)';

export type DownloadStatus = 
  | 'IDLE' 
  | 'ANALYZING' 
  | 'READY' 
  | 'DOWNLOADING' 
  | 'PAUSED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'ERROR';

export interface DownloadItem {
  id: string;
  url: string;
  title: string;
  source: 'YouTube' | 'TikTok' | 'Instagram' | 'Twitter/X' | 'SoundCloud' | 'Vimeo' | 'Reddit' | 'Direct Media';
  format: ExportFormat;
  quality: string;
  duration: string;
  sizeMb: number;
  progress: number;
  status: DownloadStatus;
  speedMb: number;
  etaSeconds: number;
  timestamp: string;
  bitrate?: string;
  codec?: string;
}

export interface PlatformConfig {
  name: string;
  domain: string;
  iconName: string;
  badge: string;
  accent: string;
  supportedFormats: ExportFormat[];
}
