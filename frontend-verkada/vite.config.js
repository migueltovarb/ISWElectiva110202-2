import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000  // 👈 Esto es lo que hace que npm run dev corra en localhost:3000
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/pages/__tests__/setup.js'
  }
})
