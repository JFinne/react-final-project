import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy raider.io API during development to avoid CORS
      // Local request: /api/raider/characters/profile?region=us&realm=some&name=player
      '/api/raider': {
        // Forward to Raider.IO's v1 API paths
        target: 'https://raider.io',
        changeOrigin: true,
        // local: /api/raider/characters/profile -> remote: /api/v1/characters/profile
        rewrite: (path) => path.replace(/^\/api\/raider/, '/api/v1'),
        // Add some headers the site expects so it doesn't respond with the HTML homepage
        headers: {
          referer: 'https://raider.io/',
          // Note: browsers set Origin; this header is for the proxied request to target server.
          origin: 'https://raider.io',
        },
      },
    },
  },
})
