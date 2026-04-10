import { createRequire } from 'node:module';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const require = createRequire(import.meta.url);
const geistCss = require.resolve('@fontsource-variable/geist/index.css');

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@fontsource-variable/geist': geistCss,
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
