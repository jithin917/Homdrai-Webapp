import { defineConfig } from 'vite';
Import visualizer from rollup-plugin-visualizer ;
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),visualizer()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
