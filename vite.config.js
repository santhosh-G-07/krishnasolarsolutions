import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "frontend",
  envDir: "..",
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    assetsDir: "react-assets",
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3000",
      "/uploads": "http://127.0.0.1:3000",
      "/assets": "http://127.0.0.1:3000",
    },
  },
});
