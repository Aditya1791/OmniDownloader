import { downloadMediaStream } from '../src/server/downloader.mjs';

export const config = {
  api: {
    responseLimit: false,
  },
  maxDuration: 60,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, format = 'MP4', quality = 'best', title = 'media_download' } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    const streamResult = await downloadMediaStream(url, format, quality);
    const stream = streamResult.stream || streamResult;
    const contentLength = streamResult.contentLength || null;

    const ext = format === 'MP3' ? '.mp3' : format === 'M4A' ? '.m4a' : format === 'FLAC' ? '.flac' : format === 'WebM' ? '.webm' : '.mp4';
    const safeName = (title || 'media_download').replace(/[^a-zA-Z0-9_\- ]/g, '_').trim().slice(0, 80) + ext;
    const contentType = format === 'MP3' ? 'audio/mpeg' : format === 'M4A' ? 'audio/mp4' : format === 'FLAC' ? 'audio/flac' : format === 'WebM' ? 'video/webm' : 'video/mp4';

    if (stream && typeof stream.getReader === 'function') {
      const reader = stream.getReader();
      
      // Read first chunk before committing 200 headers to avoid empty downloads
      const firstChunk = await reader.read();
      if (firstChunk.done && (!firstChunk.value || firstChunk.value.length === 0)) {
        return res.status(500).json({ error: 'Source media stream returned 0 bytes' });
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeName)}"`);
      if (contentLength) {
        res.setHeader('Content-Length', contentLength.toString());
      }

      if (firstChunk.value) {
        res.write(Buffer.from(firstChunk.value));
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      return res.end();
    } else if (stream && typeof stream.pipe === 'function') {
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeName)}"`);
      if (contentLength) {
        res.setHeader('Content-Length', contentLength.toString());
      }
      return stream.pipe(res);
    } else {
      return res.status(500).json({ error: 'Stream is not readable' });
    }
  } catch (err) {
    console.error('Vercel Download API Error:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message || 'Stream download failed' });
    }
  }
}
