import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// Use repo subpath only for production builds (GitHub Pages).
// Dev/preview run at root for the Lovable sandbox.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/electronic-hive/" : "/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: { host: "::", port: 8080, strictPort: true },
}));
