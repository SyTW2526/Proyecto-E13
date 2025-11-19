import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "dist/stats.html",
    }),
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5200",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Configuración de build y optimización de chunks
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Orden importante: de más específico a más general

            // Iconos primero (contienen "react" en el nombre)
            if (id.includes("@radix-icons")) return "radix-icons-vendor";
            if (id.includes("lucide-react")) return "lucide-icons-vendor";

            // React y relacionados
            if (id.includes("react-dom")) return "react-dom-vendor";
            if (id.includes("react-router")) return "router-vendor";

            // Radix UI (contiene "react" en el path)
            if (id.includes("@radix-ui")) {
              const match = id.match(/@radix-ui\/react-([^/]+)/);
              return match ? `radix-${match[1]}` : "radix-vendor";
            }

            // React core (después de haber filtrado todo lo que contiene "react")
            if (id.includes("node_modules/react/")) return "react-vendor";

            // Otras librerías grandes
            if (id.includes("redux") || id.includes("@reduxjs"))
              return "redux-vendor";
            if (id.includes("axios")) return "axios-vendor";

            // Lo demás
            return "vendor";
          }
        },
      },
    },
    // Aumentar el límite de advertencia de tamaño de chunk
    chunkSizeWarningLimit: 2700,
  },
});
