import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Respect an externally assigned port (e.g. from preview tooling); Vite ignores PORT by default
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
  build: {
    outDir: 'dist',
  },
})
