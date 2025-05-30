import { fileURLToPath, URL } from 'node:url'
import json from '@rollup/plugin-json'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    json(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.ico', 'img/icon.png'],
      manifest: {
        name: 'Sendpathy App',
        short_name: 'Sendpathy',
        lang: 'fr-FR',
        description: 'Une application de soutien émotionnel et de partage anonymisé',
        categories: ['mental health', 'social', 'lifestyle'],
        theme_color: '#e9e9f7',
        background_color: '#e9e9f7',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/img/icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/img/icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true
  }
})

