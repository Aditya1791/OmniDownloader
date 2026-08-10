import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { getMediaInfo, downloadMediaStream } from './src/server/downloader.mjs';

function apiPlugin() {
  return {
    name: 'omnidownload-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const urlObj = new URL(req.url || '', `http://${req.headers.host}`);
          
          if (urlObj.pathname === '/api/info') {
            const targetUrl = urlObj.searchParams.get('url');
            if (!targetUrl) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'Missing url parameter' }));
            }

            const info = await getMediaInfo(targetUrl);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(info));
          }

          if (urlObj.pathname === '/api/download') {
            const targetUrl = urlObj.searchParams.get('url');
            const format = urlObj.searchParams.get('format') || 'MP4';
            const quality = urlObj.searchParams.get('quality') || 'best';
            const title = urlObj.searchParams.get('title') || 'media_download';

            if (!targetUrl) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'text/plain');
              return res.end('Missing url parameter');
            }

            const stream = await downloadMediaStream(targetUrl, format, quality);
            const ext = format === 'MP3' ? '.mp3' : format === 'M4A' ? '.m4a' : format === 'WebM' ? '.webm' : '.mp4';
            const safeName = title.replace(/[^a-zA-Z0-9_\- ]/g, '_').trim().slice(0, 80) + ext;
            const contentType = format === 'MP3' ? 'audio/mpeg' : format === 'M4A' ? 'audio/mp4' : format === 'WebM' ? 'video/webm' : 'video/mp4';

            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeName)}"`);

            if (stream && typeof stream.getReader === 'function') {
              const reader = stream.getReader();
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(Buffer.from(value));
              }
              return res.end();
            } else if (stream && typeof stream.pipe === 'function') {
              return stream.pipe(res);
            } else {
              res.statusCode = 500;
              return res.end('Stream not readable');
            }
          }
        } catch (err) {
          console.error('API Middleware Error:', err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
          }
        }

        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        tailwindcss(),
        apiPlugin(),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
