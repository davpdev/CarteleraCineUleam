import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Mi PWA React",
        short_name: "React-PWA",
        description: "PWA creada con Vite + React + TypeScript",
        theme_color: "#ffffff",
        icons: [
          {
            src: "logoUleam.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "logoUleam.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "logoUleam.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],

})
