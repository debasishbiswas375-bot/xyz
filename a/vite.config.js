import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: 'a/static',   // 🔥 IMPORTANT
    emptyOutDir: true,
  },

  base: '/', // IMPORTANT
})
