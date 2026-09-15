import { Innertube, Platform } from 'youtubei.js';

// Setup JavaScript eval environment for YouTube.js deciphering
Platform.shim.eval = async (data, env) => {
  const code = data.output || data;
  return new Function(...Object.keys(env || {}), code)(...Object.values(env || {}));
};

let ytAndroidInstance = null;

async function getAndroidClient() {
  if (!ytAndroidInstance) {
    ytAndroidInstance = await Innertube.create({ client_type: 'ANDROID' });
  }
  return ytAndroidInstance;
}

export function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|music\.youtube\.com\/watch\?v=))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Configurable Cobalt Instances (e.g. self-hosted or user-provided)
const COBALT_INSTANCES = [
  process.env.COBALT_API_URL,
].filter(Boolean);

export async function requestCobalt(url, format = 'MP4', quality = '1080') {
  if (COBALT_INSTANCES.length === 0) {
    throw new Error('No Cobalt instances configured');
  }

  const isAudio = format === 'MP3' || format === 'M4A' || format === 'FLAC';
  
  let vQuality = '1080';
  if (quality.includes('4320') || quality.includes('8K')) vQuality = 'max';
  else if (quality.includes('2160') || quality.includes('4K')) vQuality = '2160';
  else if (quality.includes('1440') || quality.includes('2K')) vQuality = '1440';
  else if (quality.includes('1080')) vQuality = '1080';
  else if (quality.includes('720')) vQuality = '720';
  else if (quality.includes('480')) vQuality = '480';
  else if (quality.includes('360')) vQuality = '360';

  const payload = {
    url,
    videoQuality: vQuality,
    audioFormat: isAudio ? (format === 'M4A' ? 'm4a' : 'mp3') : undefined,
    downloadMode: isAudio ? 'audio' : 'auto',
    youtubeVideoCodec: 'h264',
    filenameStyle: 'pretty',
  };

  let lastError = null;
  for (const endpoint of COBALT_INSTANCES) {
    try {
      const res = await fetch(endpoint.endsWith('/') ? endpoint : `${endpoint}/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'OmniDownload/1.0',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Cobalt ${res.status}: ${text}`);
      }

      const data = await res.json();
      if (data.status === 'error') {
        throw new Error(data.error?.code || data.text || 'Cobalt extraction error');
      }
      return data;
    } catch (err) {
      lastError = err;
      console.warn(`Cobalt instance ${endpoint} attempt failed:`, err.message);
    }
  }

  throw lastError || new Error('Cobalt service unavailable');
}

export async function getMediaInfo(url) {
  const ytId = extractYouTubeId(url);
  if (ytId) {
    try {
      const yt = await getAndroidClient();
      const info = await yt.getBasicInfo(ytId);
      const title = info.basic_info.title || 'YouTube Video';
      const author = info.basic_info.author || 'YouTube Creator';
      const durationSec = info.basic_info.duration || 0;
      const minutes = Math.floor(durationSec / 60);
      const seconds = durationSec % 60;
      const duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      const thumbnail = info.basic_info.thumbnail?.[0]?.url || `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
      
      // Calculate realistic size estimate
      const estimatedSizeMb = durationSec > 0 
        ? Math.max(5.0, parseFloat(((durationSec * 2.5) / 8).toFixed(1))) 
        : 25.0;

      return {
        success: true,
        source: 'YouTube',
        id: ytId,
        title,
        author,
        duration,
        durationSec,
        thumbnail,
        formats: ['MP4', 'MP3', 'WebM', 'M4A', 'FLAC'],
        estimatedSizeMb,
      };
    } catch (ytErr) {
      console.warn('Innertube getBasicInfo failed for YouTube ID:', ytId, ytErr.message);
    }
  }

  // Parse platform from URL
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Invalid URL format');
  }

  const hostname = parsedUrl.hostname.replace('www.', '');
  const pathname = parsedUrl.pathname;
  const fileName = pathname.split('/').filter(Boolean).pop() || 'Media_Stream';

  let source = 'Direct Media Stream';
  if (hostname.includes('tiktok')) source = 'TikTok';
  else if (hostname.includes('instagram')) source = 'Instagram';
  else if (hostname.includes('twitter') || hostname.includes('x.com')) source = 'Twitter/X';
  else if (hostname.includes('soundcloud')) source = 'SoundCloud';
  else if (hostname.includes('vimeo')) source = 'Vimeo';
  else if (hostname.includes('reddit')) source = 'Reddit';
  else if (hostname.includes('pinterest')) source = 'Pinterest';
  else if (hostname.includes('facebook') || hostname.includes('fb.watch')) source = 'Facebook';

  // If Cobalt is configured, try it
  if (COBALT_INSTANCES.length > 0) {
    try {
      const cobaltData = await requestCobalt(url);
      const extractedTitle = cobaltData.filename ? cobaltData.filename.replace(/\.[^/.]+$/, '') : `${source} Media`;
      return {
        success: true,
        source,
        id: Buffer.from(url).toString('base64').slice(0, 12),
        title: extractedTitle,
        author: hostname,
        duration: '01:30',
        durationSec: 90,
        thumbnail: '',
        formats: ['MP4', 'MP3'],
        estimatedSizeMb: 18.5,
      };
    } catch (cErr) {
      console.warn('Cobalt metadata check note:', cErr.message);
    }
  }

  return {
    success: true,
    source,
    id: Buffer.from(url).toString('base64').slice(0, 12),
    title: `${source} - ${fileName.replace(/[^a-zA-Z0-9_-]/g, ' ')}`,
    author: hostname,
    duration: '03:45',
    durationSec: 225,
    thumbnail: '',
    formats: ['MP4', 'MP3', 'WebM', 'M4A'],
    estimatedSizeMb: 35.0,
  };
}

export async function downloadMediaStream(url, format = 'MP4', quality = 'best') {
  const ytId = extractYouTubeId(url);
  
  // 1. YouTube Direct High-Speed Extraction Engine
  if (ytId) {
    try {
      const yt = await getAndroidClient();
      const info = await yt.getBasicInfo(ytId);

      // Look for progressive format with direct working GoogleVideo URL
      const progressiveFormats = info.streaming_data?.formats || [];
      const bestProgFormat = progressiveFormats.find(f => f.has_video && f.has_audio && f.url) || progressiveFormats[0];

      if (bestProgFormat && bestProgFormat.url) {
        const response = await fetch(bestProgFormat.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
          },
        });

        if (response.ok && response.body) {
          const contentLength = response.headers.get('content-length');
          return {
            stream: response.body,
            contentLength: contentLength ? parseInt(contentLength, 10) : null,
            contentType: bestProgFormat.mime_type?.split(';')[0] || 'video/mp4',
          };
        }
      }

      // Innertube direct download fallback
      const stream = await yt.download(ytId, {
        type: 'video+audio',
        quality: 'best',
      });

      if (stream) {
        return {
          stream,
          contentLength: null,
          contentType: 'video/mp4',
        };
      }
    } catch (ytErr) {
      console.warn('Innertube direct extraction error for YouTube:', ytErr.message);
      throw new Error(`YouTube extraction failed: ${ytErr.message}`);
    }
  }

  // 2. Cobalt multi-platform extraction (if configured)
  if (COBALT_INSTANCES.length > 0) {
    try {
      const cobaltData = await requestCobalt(url, format, quality);
      const downloadUrl = cobaltData.url || (cobaltData.picker && cobaltData.picker[0]?.url);
      if (downloadUrl) {
        const response = await fetch(downloadUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          },
        });
        if (response.ok && response.body) {
          const contentLength = response.headers.get('content-length');
          return {
            stream: response.body,
            contentLength: contentLength ? parseInt(contentLength, 10) : null,
            contentType: response.headers.get('content-type') || 'video/mp4',
          };
        }
      }
    } catch (cobaltErr) {
      console.warn('Cobalt stream retrieval failed:', cobaltErr.message);
    }
  }

  // 3. Direct Media Stream fetch (for direct audio/video files)
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    // Prevent streaming HTML webpages as fake video/audio files
    if (contentType.includes('text/html')) {
      throw new Error('The target URL returned a webpage instead of a media stream. Please use a direct media link or supported YouTube URL.');
    }

    const contentLength = response.headers.get('content-length');
    return {
      stream: response.body,
      contentLength: contentLength ? parseInt(contentLength, 10) : null,
      contentType,
    };
  } catch (err) {
    throw new Error(`Failed to stream media from source: ${err.message}`);
  }
}
