import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Todo lo que empiece con /api se redirige a SportMonks
      "/api": {
        target: "https://api.sportmonks.com/v3", // API real
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // quita /api al llamar al externo
      },
    },
  },
});