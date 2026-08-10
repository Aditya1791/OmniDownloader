import { getMediaInfo } from '../src/server/downloader.mjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    const info = await getMediaInfo(url);
    return res.status(200).json(info);
  } catch (err) {
    console.error('Vercel Info API Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to extract media information' });
  }
}
