import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/// <reference types="vitest" />
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/components/Treemap/index.ts',
      name: 'VueOGram',
      fileName: (format) => `vue-o-gram.${format === 'es' ? 'es' : 'umd'}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
