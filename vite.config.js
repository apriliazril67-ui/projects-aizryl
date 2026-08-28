import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Saat development lokal dengan `vercel dev`, endpoint /api sudah otomatis
      // ditangani oleh Vercel CLI. Proxy ini hanya fallback jika memakai `vite` biasa
      // bersama server backend terpisah di port 3000.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
