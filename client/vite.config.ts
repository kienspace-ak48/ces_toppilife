import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'pre_video': path.resolve(__dirname, './src/assets/pre_video.png')
    }
  },
  build: {
    // Phải trùng với Express: res.sendFile(.../public/index.html) + express.static(public)
    // Trước đây outDir = public/bin nên bundle mới không được index.html ở root trỏ tới.
    outDir: path.resolve(__dirname, '../server/public'),
    emptyOutDir: false,
  },
})
