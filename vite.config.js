import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@electric-sql/pglite'], // In order to exlcude dependency optimization for wasm file, as this could reduce the size of the wasm file leading to errors creating db
  },worker: {
    format: 'es',
  },
})
