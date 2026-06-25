import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig(() => ({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    emptyOutDir: true,
    outDir: "dist",
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: true as const,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/objects": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
}));
