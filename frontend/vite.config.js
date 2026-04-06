import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": srcPath,
    },
  },
  server: {
    proxy: {
      "/api": "https://zorvyn-y06e.onrender.com",
      "/api-docs": "https://zorvyn-y06e.onrender.com",
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
