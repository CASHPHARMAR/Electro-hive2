import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// Set VITE_BASE_PATH="/electronic-hive/" when deploying to GitHub Pages.
// Leave unset (defaults to "/") for Netlify, Vercel, custom domains, and local dev.
export default defineConfig(() => ({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: true as const,
  },
}));
