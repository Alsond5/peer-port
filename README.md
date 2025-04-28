# PeerPort

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

PeerPort is a secure, browser-based peer-to-peer file transfer web application built with SvelteKit and WebRTC. Files are streamed directly between peers—no server-side storage required.

---

## 🚀 Features

- **Pure P2P Transfers**  
  Uses WebRTC DataChannels for direct, end-to-end file streaming between browsers.  
- **Zero-Storage Signaling for Connection**  
  Share a unique URL to establish the connection—no backend database or file hosting.  
- **TypeScript & SvelteKit**  
  Modern, type-safe codebase with SvelteKit’s file-based routing and Vite-powered dev tooling.  
- **Responsive UI**  
  Mobile and desktop‐friendly layout with minimal dependencies.  

---

## 📦 Getting Started

### Prerequisites

- **Bun.js** v1.2 or higher for **bun**
- **Node.js** v20.6 or higher for **npm**

### Installation

1. Clone the repo  
   ```bash
   git clone https://github.com/Alsond5/peer-port.git
   cd peer-port
   ```
2. Install dependencies
   ```bash
   # bun
   bun install
    
   # or npm
   npm install
   ```

## Developing

Once you've created a project and installed dependencies with `bun install` (or `npm install`), start a development server:

```bash
bun run dev
# or npm run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
# or npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
bun run build
# or npm run build
```

You can preview the production build with `bun run preview`.

## 📝 License

Distributed under the **GNU General Public License v3.0**. See [LICENSE](LICENSE) for details.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
