import { Innertube, Platform } from 'youtubei.js';

Platform.shim.eval = async (data, env) => {
  const code = data.output || data;
  return new Function(...Object.keys(env || {}), code)(...Object.values(env || {}));
};

let ytWebInstance = null;
let ytAndroidInstance = null;

async function getWebClient() {
  if (!ytWebInstance) {
    ytWebInstance = await Innertube.create();
  }
  return ytWebInstance;
}

async function getAndroidClient() {
  if (!ytAndroidInstance) {
    ytAndroidInstance = await Innertube.create({ client_type: 'ANDROID' });
  }
  return ytAndroidInstance;
}

export function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export async function getMediaInfo(url) {
  const ytId = extractYouTubeId(url);
  if (ytId) {
    const yt = await getWebClient();
    const info = await yt.getBasicInfo(ytId);
    const title = info.basic_info.title || 'YouTube Video';
    const author = info.basic_info.author || 'YouTube Creator';
    const durationSec = info.basic_info.duration || 0;
    const minutes = Math.floor(durationSec / 60);
    const seconds = durationSec % 60;
    const duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const thumbnail = info.basic_info.thumbnail?.[0]?.url || `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
    
    return {
      success: true,
      source: 'YouTube',
      id: ytId,
      title,
      author,
      duration,
      durationSec,
      thumbnail,
      formats: ['MP4', 'MP3', 'WebM', 'M4A'],
      estimatedSizeMb: Math.max(8.0, parseFloat(((durationSec * 2.8) / 8).toFixed(1))),
    };
  }

  // Fallback for general web stream links
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.replace('www.', '');
  const pathname = urlObj.pathname;
  const fileName = pathname.split('/').filter(Boolean).pop() || 'Media_Stream';

  let source = 'Direct Media Stream';
  if (hostname.includes('tiktok')) source = 'TikTok';
  else if (hostname.includes('instagram')) source = 'Instagram';
  else if (hostname.includes('twitter') || hostname.includes('x.com')) source = 'Twitter/X';
  else if (hostname.includes('soundcloud')) source = 'SoundCloud';
  else if (hostname.includes('vimeo')) source = 'Vimeo';
  else if (hostname.includes('reddit')) source = 'Reddit';

  return {
    success: true,
    source,
    id: Buffer.from(url).toString('base64').slice(0, 12),
    title: `${source} - ${fileName.replace(/[^a-zA-Z0-9_-]/g, ' ')}`,
    author: hostname,
    duration: '03:45',
    durationSec: 225,
    thumbnail: '',
    formats: ['MP4', 'MP3', 'WebM'],
    estimatedSizeMb: 35.0,
  };
}

export async function downloadMediaStream(url, format = 'MP4', quality = 'best') {
  const ytId = extractYouTubeId(url);
  if (ytId) {
    const yt = await getAndroidClient();
    const stream = await yt.download(ytId, {
      type: 'video+audio',
      quality: 'best',
    });
    return stream;
  }

  // Direct URL stream proxy
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    },
  });
  if (!response.ok) throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
  return response.body;
}
