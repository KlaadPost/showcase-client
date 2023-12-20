import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ svelte() ],
  build: {
    lib: { 
      entry: 'src/main.ts', 
      formats: ['cjs'],
    },
    emptyOutDir: true,
    cssCodeSplit: true, // Enable CSS code splitting
    cssMinify: true, // Enable CSS minification using esbuild by default

    rollupOptions: {
      output: {
        entryFileNames: 'showcase-components.js', // Rename the JS file
        assetFileNames: 'showcase-pico[extname]', // Rename the CSS file
        dir: '../showcase-web/Showcase/Showcase.Web/wwwroot/lib/showcase/dist', // Output directory for all files
      },  
    }, 
  },
})
