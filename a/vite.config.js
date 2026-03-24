import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: '../a/static',   // 🔥 VERY IMPORTANT
    emptyOutDir: true,       // 🔥 CLEAN BUILD
  },

  base: '/', // 🔥 IMPORTANT for FastAPI

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
