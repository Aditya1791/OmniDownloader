<div align="center">

# ⚡ OmniDownload
### *Universal High-Bitrate Media Downloader & Stream Extractor*

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

<p align="center">
  A blazing-fast, high-contrast, multi-threaded media extraction workstation. <br />
  Download videos, audio, playlists, and streams from YouTube, TikTok, Instagram, Twitter/X, SoundCloud, and direct web sources in original master fidelity with zero rate limits.
</p>

<!-- Social Connect Badges -->
<p align="center">
  <a href="https://github.com/YOUR_GITHUB_USERNAME">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  &nbsp;
  <a href="https://linkedin.com/in/YOUR_LINKEDIN_USERNAME">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  &nbsp;
  <a href="https://twitter.com/YOUR_TWITTER_USERNAME">
    <img src="https://img.shields.io/badge/Twitter%20%2F%20X-000000?style=for-the-badge&logo=x&logoColor=white" alt="Twitter/X" />
  </a>
  &nbsp;
  <a href="mailto:your.email@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail" />
  </a>
</p>

</div>

---

## 🌟 Key Features

<table>
  <tr>
    <td width="50%">
      <h3>🎯 Universal Stream Extraction</h3>
      <p>Direct integration with YouTube, YouTube Shorts, TikTok, Instagram Reels, Twitter/X Media, SoundCloud tracks, Vimeo, Reddit, and direct CDN MP4/MP3 streams.</p>
    </td>
    <td width="50%">
      <h3>💎 Studio Master Audio & Video</h3>
      <p>Export in <strong>MP4</strong> (H.264/HEVC), <strong>MP3</strong> (320kbps Lossless), <strong>WebM</strong> (VP9/Opus), <strong>FLAC</strong> (24-bit 96kHz), and <strong>M4A</strong> with automatic resolution scaling up to 4K/8K 60fps HDR.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⚡ Real-Time Streaming Engine</h3>
      <p>Built on top of a low-latency streaming pipeline that bypasses 403 throttling, displays real-time download bandwidth (MB/s), estimated time remaining (ETA), and saves directly to disk.</p>
    </td>
    <td width="50%">
      <h3>🌗 Stark High-Contrast Aesthetics</h3>
      <p>Engineered with brutalist architectural lines (1.5px borders), Oswald display typography, Space Mono telemetry counters, and seamless one-click Dark/Light mode theme inversion.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📋 Smart Clipboard Auto-Paste</h3>
      <p>Instant clipboard analysis: simply click <strong>PASTE</strong> or press fetch to extract video metadata, duration, creator info, and high-definition cover thumbnails in milliseconds.</p>
    </td>
    <td width="50%">
      <h3>📦 Batch Queue & Library</h3>
      <p>Queue multiple URLs for sequential or parallel batch extraction, track item-level progress, and manage completed downloads in the local session library.</p>
    </td>
  </tr>
</table>

---

## 🌐 Supported Platforms & Stream Matrix

| Platform | Format Capabilities | Quality Profile | Anti-Bot Bypass |
| :--- | :--- | :--- | :---: |
| **YouTube** | MP4 Video, MP3 Audio, WebM, M4A | 8K / 4K / 1080p FHD / 720p / 320k | `ANDROID` Client Spoofing |
| **YouTube Shorts** | MP4 Video, MP3 Audio | High Bitrate 1080x1920 Vertical | Built-in |
| **TikTok** | MP4 Video (No Watermark), MP3 | Original HD Stream | Direct Stream |
| **Instagram** | MP4 Video (Reels / Posts / Stories) | Highest Source Bitrate | Direct CDN |
| **Twitter / X** | MP4 Video | 1080p / 720p Mobile/Web | Direct Pipeline |
| **SoundCloud** | MP3 / FLAC Studio Audio | 320 kbps Lossless Master | Audio Stream |
| **Vimeo** | MP4 / WebM Video | Pro Cinema 1080p / 4K | Direct HLS |
| **Direct Media** | MP4, WebM, MP3, FLAC, M4A | Direct Source Bitrate | HTTP Proxy |

---

## 🚀 Quick Start Guide

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (version 18.0.0 or higher) installed on your system.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/OmniDownload.git
cd OmniDownload
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Launch Development Server

```bash
npm run dev
```

The web application will immediately launch at **`http://localhost:3000`**.

### 4. Production Build

To test and compile the production bundle:

```bash
npm run build
```

---

## 📁 Project Architecture

```plaintext
OmniDownload/
├── public/                     # Static public assets
├── src/
│   ├── components/             # Reusable UI components
│   ├── server/                 # Backend streaming & extraction engine
│   │   └── downloader.mjs      # YouTube.js Innertube & media stream pipeline
│   ├── App.tsx                 # OmniDownload core workstation & UI router
│   ├── main.tsx                # React 19 root DOM renderer
│   ├── types.ts                # TypeScript interfaces & type definitions
│   └── index.css               # Design system tokens & Tailwind CSS v4 rules
├── index.html                  # HTML entry with typography (Oswald, Inter, Space Mono)
├── vite.config.ts              # Vite 6 config with real download API middleware
├── tsconfig.json               # TypeScript compiler configuration
└── package.json                # Project dependencies and lifecycle scripts
```

---

## 🛠️ Technology Stack

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Engine**: [Vite 6](https://vitejs.dev/) with custom integrated API streaming middleware
- **Design & Typography**: [Tailwind CSS v4](https://tailwindcss.com/), [Oswald](https://fonts.google.com/specimen/Oswald), [Inter](https://fonts.google.com/specimen/Inter), [Space Mono](https://fonts.google.com/specimen/Space+Mono)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Media Extraction**: [YouTube.js (Innertube)](https://github.com/LuanRT/YouTube.js) with client spoofing & dynamic deciphering

---

## 🤝 Connect & Socials

If you find this project helpful, feel free to give it a ⭐ on GitHub and connect!

<p align="left">
  <a href="https://github.com/YOUR_GITHUB_USERNAME" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Follow%20Me-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Follow" />
  </a>
  &nbsp;
  <a href="https://linkedin.com/in/YOUR_LINKEDIN_USERNAME" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Connect" />
  </a>
  &nbsp;
  <a href="https://twitter.com/YOUR_TWITTER_USERNAME" target="_blank">
    <img src="https://img.shields.io/badge/Twitter%20%2F%20X-Follow-000000?style=for-the-badge&logo=x&logoColor=white" alt="Twitter Follow" />
  </a>
  &nbsp;
  <a href="mailto:your.email@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-Contact%20Me-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail Contact" />
  </a>
</p>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Built with precision and high-contrast aesthetics by the OmniDownload Team.</sub>
</div>
