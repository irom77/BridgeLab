import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import clientPackage from "./package.json" with { type: "json" };

export default defineConfig({
  base: "./",
  plugins: [react()],
  define: { __CONTRACTPLAY_VERSION__: JSON.stringify(clientPackage.version) }
});
