import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/// <reference types="vitest" />
// https://vitejs.dev/config/
export default defineConfig({
  root: 'dev/',
  plugins: [vue()],
  build: {
    lib: {
      entry: 'dev/main.ts',
      name: 'vue-o-gram',
      fileName: (format) => `my-lib.${format}.ts`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
