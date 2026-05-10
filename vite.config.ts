import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

// * Vite configuration with React, PWA support, and RTL-friendly defaults
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Weapon Inventory Management",
        short_name: "WIM",
        description: "Role-based weapon inventory and issue management SPA",
        theme_color: "#1976d2",
        dir: "rtl",
        lang: "he",
        icons: [],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
