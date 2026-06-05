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
    host: "localhost",
  },
  define:{
          CESIUM_BASE_URL: JSON.stringify('https://cesium.com/downloads/cesiumjs/releases/1.114/Build/Cesium'),
  }
});