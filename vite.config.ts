import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['icon-192.png', 'icon-512.png'],
    manifest: {
      name: 'Phrase to Number — แปลงวลีเป็นตัวเลข',
      short_name: 'Phrase2Number',
      description: 'แปลงวลีเป็นตัวเลขแบบส่วนตัว ประมวลผลบนอุปกรณ์ของคุณ',
      theme_color: '#101820',
      background_color: '#101820',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    }
  })]
})
