import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/proofpath/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  root: path.resolve(import.meta.dirname, "classroom"),
  publicDir: path.resolve(import.meta.dirname, "classroom", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "classroom-dist"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: true,
  },
});
