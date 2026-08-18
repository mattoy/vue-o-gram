import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

/// <reference types="vitest" />
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'dist',
      rollupTypes: true,
      entryRoot: 'src/components/Treemap',
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: 'src/components/Treemap/index.ts',
      name: 'vue-o-gram',
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
