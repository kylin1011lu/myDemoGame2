import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'preview', // 复制整个preview目录
          dest: ''        // 复制到dist根目录
        }
      ]
    })
  ],
  server: {
    port: 3000
  },
  // 不将preview目录作为publicDir或源码目录
  publicDir: false,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      // 排除preview目录
      external: [],
    },
    // 也可用emptyOutDir: true，保证dist干净
  }
}) 