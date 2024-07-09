import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/PathFindingVisualizer/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // Specify the output directory
    emptyOutDir: true, // Clear the output directory before building
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "./src/main.jsx"),
      },
    },
  },
});
