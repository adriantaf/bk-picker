import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";

const host = process.env.TAURI_DEV_HOST;

function appHtmlAsIndex() {
  return {
    name: "app-html-as-index",
    configureServer(server: { middlewares: { use: Function } }) {
      server.middlewares.use(
        (req: { url?: string }, _res: unknown, next: () => void) => {
          const url = req.url ?? "";
          if (url === "/" || url.startsWith("/?") || url.startsWith("/index.html")) {
            req.url = "/app.html" + (url.includes("?") ? url.slice(url.indexOf("?")) : "");
          }
          next();
        },
      );
    },
    closeBundle() {
      const dist = path.resolve(__dirname, "dist");
      const from = path.join(dist, "app.html");
      const to = path.join(dist, "index.html");
      if (fs.existsSync(from)) {
        fs.renameSync(from, to);
      }
    },
  };
}

export default defineConfig(async () => ({
  plugins: [react(), tailwindcss(), appHtmlAsIndex()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  clearScreen: false,
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "app.html"),
    },
  },
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
