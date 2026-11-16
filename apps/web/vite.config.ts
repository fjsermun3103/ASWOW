/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // En desarrollo, /api/* se reenvía a la API Fastify (puerto 3001) quitando el prefijo /api.
    // Así web y API comparten origen, igual que en producción con el proxy de Cloudflare Pages.
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // El AudioWorklet (sintetizador) se empaqueta como módulo ES.
  worker: { format: 'es' },
  test: {
    environment: 'node',
  },
});
