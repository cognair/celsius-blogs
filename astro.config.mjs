import { defineConfig } from "astro/config";
import cloudflare from '@astrojs/cloudflare';
import react from "@astrojs/react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Astro 5 transforms image imports (jpg/png/webp/etc.) into ImageMetadata objects
// { src, width, height, format }. React components expect plain URL strings.
// This plugin intercepts image imports from .tsx/.ts files and appends ?url so
// Vite returns the plain URL string instead of the metadata object.
const imageAsUrlPlugin = {
  name: "vite-plugin-tsx-image-as-url",
  enforce: "pre",
  async resolveId(source, importer) {
    if (
      importer &&
      /\.(tsx|ts|jsx|js)$/.test(importer.split("?")[0]) &&
      /\.(jpg|jpeg|png|gif|webp|avif)$/.test(source.split("?")[0]) &&
      !source.includes("?")
    ) {
      const resolved = await this.resolve(source, importer, { skipSelf: true });
      if (resolved) {
        return resolved.id.split("?")[0] + "?url";
      }
    }
  },
};

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  output:"server",
  integrations: [react()],
  // 301 old /blog/cat-ear-infection URL (subdomain has /blog/ baked in by name,
  // so the path is redundant). Preserves any external links already shared.
  redirects: {
    "/blog/cat-ear-infection": {
      status: 301,
      destination: "/cat-ear-infection",
    },
  },
  vite: {
    plugins: [imageAsUrlPlugin],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
    server: {
      host: true,
      port: 8080,
    },
  },
});
