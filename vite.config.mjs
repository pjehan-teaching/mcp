import { defineConfig } from 'vite';

// revealexpress loads the bundle with classic tags (see slideshow.config.js): build an IIFE library, not an app
export default defineConfig({
  // Copied as is into assets/ (src/public/images/logo.png → assets/images/logo.png)
  publicDir: 'src/public',
  build: {
    outDir: 'assets',
    emptyOutDir: true,
    lib: {
      entry: 'src/main.js',
      formats: ['iife'],
      name: 'slideshow',
      fileName: () => 'js/script.js',
      cssFileName: 'css/style',
    },
  },
});
