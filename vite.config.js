import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 部署時的 base URL
  base: process.env.NODE_ENV === 'production' ? '/vueReviewCopyTradeAddressFilter(250426)/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      'events': 'events',
    },
  },
  optimizeDeps: {
    include: ['events'],
  },
  server: {
    host: true, // 監聽所有地址
    port: 5173,
    strictPort: true, // 如果端口被占用，則直接退出
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    }
  }
})
