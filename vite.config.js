import { defineConfig } from 'vite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copyStaticAssetsPlugin() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const srcBase = path.resolve(__dirname, 'src');
      const distBase = path.resolve(__dirname, 'dist');
      const dirsToCopy = ['css', 'js', 'images'];

      for (const dir of dirsToCopy) {
        const fromPath = path.resolve(srcBase, dir);
        const toPath = path.resolve(distBase, dir);
        if (fs.existsSync(fromPath)) {
          fs.cpSync(fromPath, toPath, { recursive: true });
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [copyStaticAssetsPlugin()],
  root: path.resolve(__dirname, 'src'),
  base: './',
  server: {
    port: 5173,
    strictPort: false,
    host: 'localhost',
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    target: 'chrome120',
    assetsDir: 'assets',
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
