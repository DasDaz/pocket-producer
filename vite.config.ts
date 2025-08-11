
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If you use the default GitHub Pages URL, keep base as '/pocket-producer/'.
// If you use a custom domain, change base to '/'.
export default defineConfig({
  base: '/',
  plugins: [react()]
})
