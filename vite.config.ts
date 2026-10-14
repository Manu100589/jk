import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: ".site-build",
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL("./src/main.tsx", import.meta.url)),
      formats: ["es"],
      fileName: () => "site-runtime.js",
      cssFileName: "site-runtime",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
