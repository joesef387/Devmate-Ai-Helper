import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Devmate-Ai-Helper/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000"
    }
  }
});