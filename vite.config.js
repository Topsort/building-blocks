import preact from "@preact/preset-vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";

export default defineConfig({
  root: ".",
  resolve: {
    alias: {
      "@api": resolve(__dirname, "src/api/"),
      "@components": resolve(__dirname, "src/components/"),
      "@constants": resolve(__dirname, "src/constants"),
      "@context": resolve(__dirname, "src/context"),
      "@hooks": resolve(__dirname, "src/hooks/"),
      "@services": resolve(__dirname, "src/services/"),
      "@state": resolve(__dirname, "src/state"),
      "@types": resolve(__dirname, "src/types"),
      "@utils": resolve(__dirname, "src/utils/"),
    },
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.tsx"),
      name: "building-blocks",
      // the proper extensions will be added
      fileName: (format) =>
        `index.${format === "es" ? "mjs" : format === "umd" ? "js" : "js"}`,
      formats: ["es", "umd"],
    },
    // Relative to the root
    outDir: "dist",
  },
  plugins: [preact(), EnvironmentPlugin({ NODE_ENV: "production" })],
});
