import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import pkg from "../package.json";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  // Surface the @trf/ui2 version (tracks the cut tag) to the sink header.
  define: {
    __UI2_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    // Single React copy even though @trf/ui2 is a symlinked file: dependency.
    dedupe: ["react", "react-dom", "lucide-react"],
  },
  server: {
    host: "0.0.0.0",
    port: 5180,
    strictPort: true,
  },
});
