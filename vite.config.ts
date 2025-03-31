import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/my-gym-tracker/',
  server: {
    port: 3000
  }
})
