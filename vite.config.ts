import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [vue()],
  base: '/whoami/',
  server: {
    port: 3000 // Optional: specify a port
  }
})