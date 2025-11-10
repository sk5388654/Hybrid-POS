import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'vite'
import svg from 'vite-plugin-svgo'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Vue-app/', // For GitHub Pages deployment
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          console.log('id: ', id)
          if (id.includes('node_modules')) return 'vendor'
          if (id.endsWith('.svg')) return path.basename(id)
          if (id.includes('module-a')) return 'module-a'
          if (id.includes('module-b')) return 'module-b'
          if (id.includes('common')) return 'common'
        }
      },
      plugins: [
        copy({
          targets: [
            { src: 'src/assets/manifest/android-chrome-192x192.png', dest: 'dist/assets/manifest' },
            { src: 'src/assets/manifest/android-chrome-512x512.png', dest: 'dist/assets/manifest' }
          ],
          hook: 'writeBundle'
        })
      ]
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('omni-')
        }
      }
    }),
    svg(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: [
      'favicon.svg',
      'robots.txt',
      'apple-touch-icon.png',
      'assets/manifest/android-chrome-192x192.png',
      'assets/manifest/android-chrome-512x512.png'
    ],
    manifest: {
      name: 'Vue Todo App',
      short_name: 'TodoApp',
      description: 'A simple offline-capable Todo App',
      theme_color: '#4F46E5',
      background_color: '#FFFFFF',
      display: 'standalone',
      scope: '/Vue-app/',
      start_url: '/Vue-app/',
      icons: [
        {
          src: 'assets/manifest/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'assets/manifest/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,json}'], // cache all JS, CSS, HTML, images, JSON
      navigateFallback: '/Vue-app/index.html', // important for SPA routing
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/sk5388654\.github\.io\/Vue-app\//,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'vue-app-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            }
          }
        }
      ]
    }
  })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
