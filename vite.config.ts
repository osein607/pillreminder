import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    compression(), // ⭐ gzip 생성
    // 필요하면 brotli 추가 → compression({ algorithm: 'brotliCompress' })
  ],
});
