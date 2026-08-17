import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'node:path';

const rootDir = import.meta.dirname;

export default defineConfig(({ mode, command }) => {
  const isDev = mode === 'development' || command === 'serve';

  return {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    build: {
      outDir: 'resources',
      assetsDir: '',
      emptyOutDir: false,
      sourcemap: isDev ? true : false,
      // Minify only in production for better DX in dev
      minify: isDev ? false : 'terser',
      terserOptions: isDev
        ? undefined
        : {
            format: {
              comments: /<\/?fs_premium_only>/i,
            },
          },
      rollupOptions: {
        input: {
          'cf7msm-admin': path.resolve(rootDir, 'assets-src/js/cf7msm-admin.js'),
          'cf7msm-notice': path.resolve(rootDir, 'assets-src/js/cf7msm-notice.js'),
          'cf7msm': path.resolve(rootDir, 'assets-src/js/cf7msm.js'),
        },
        external: ['jquery'],
        output: {
          // Map external jQuery to window.jQuery defensively
          globals: {
            jquery: 'jQuery',
          },
          // Use default 'es' output; CSS imports are extracted so JS stays classic-compatible
          // Ensure any future chunks follow our naming convention
          entryFileNames: '[name].min.js',
          chunkFileNames: '[name].min.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) return '[name].css';
            return '[name][extname]';
          },
        },
      },
      target: 'es2018',
      cssCodeSplit: true,
    },
    resolve: {
      alias: {
        '@js': path.resolve(rootDir, 'assets-src/js'),
        '@scss': path.resolve(rootDir, 'assets-src/scss'),
      },
    },
    plugins: [
      // Copy images from assets-src/images into resources/ (flat)
      viteStaticCopy({
        targets: [
          // stripBase flattens the match; without it v4+ recreates assets-src/images/ under outDir
          { src: 'assets-src/images/*', dest: '', rename: { stripBase: true } },
        ],
      }),
    ],
  };
});
