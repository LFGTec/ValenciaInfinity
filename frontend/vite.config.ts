import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {//servidro de vite hace la peticion
      "/api-football": {
        target: "https://api.football-data.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-football/, ""),
      },
      "/rss-marca": {
        target: "https://e00-marca.uecdn.es",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss-marca/, ""),
      },
      "/rss-as": {
        target: "https://as.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss-as/, ""),
      },
    },
  },
});