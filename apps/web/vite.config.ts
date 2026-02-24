import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const packagesDir = path.resolve(__dirname, "../../packages");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@flockloop/shared-types": path.resolve(packagesDir, "shared-types/src"),
      "@flockloop/auth-store": path.resolve(packagesDir, "auth-store/src"),
      "@flockloop/api-client": path.resolve(packagesDir, "api-client/src"),
      "@flockloop/audio-state": path.resolve(packagesDir, "audio-state/src"),
      "@flockloop/tailwind-config": path.resolve(packagesDir, "tailwind-config"),
    },
    dedupe: ["react", "react-dom", "zustand", "@tanstack/react-query"],
  },
  server: {
    port: 5173,
    host: true,
    fs: {
      allow: [path.resolve(__dirname, "../..")],
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
