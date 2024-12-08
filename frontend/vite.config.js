import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
      ignored: [
        '**/node_modules/**', // Exclude node_modules
        '**/.git/**', // Exclude .git
        '**/dist/**', // Exclude dist
        '**/build/**', // Exclude build
        '**/.cache/**', // Exclude .cache
        '**/.tmp/**' // Exclude .tmp
      ]
    }
  }
})
