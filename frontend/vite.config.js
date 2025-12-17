import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // port de dev, change si tu veux
    open: true, // ouvre automatiquement le navigateur
  },
});
