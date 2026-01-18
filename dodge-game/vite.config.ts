import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@scenes': resolve(__dirname, './src/scenes'),
      '@systems': resolve(__dirname, './src/systems'),
      '@entities': resolve(__dirname, './src/entities'),
      '@ui': resolve(__dirname, './src/ui'),
      '@config': resolve(__dirname, './src/config'),
      '@types': resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
