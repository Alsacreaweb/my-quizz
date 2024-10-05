import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/my-quizz/',
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['favicon.svg', 'favicon.ico'],
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'my-quizz',
      short_name: 'my-quizz',
      description: 'A quiz to play with your friends',
      theme_color: '#334155',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      navigateFallback: '/my-quizz/index.html',
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
  server: {
    open: true
  },
  build: {
    outDir: 'build'
  }
})