import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://127.0.0.1:8000",
  //       changeOrigin: true,
  //       secure: true,
  //     },
  //   },
  // }, 
  server: {
    proxy: {
      "/api": {
        target: "https://manmohey-admin.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
