import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    root: "./",
    globals: true,
    coverage: {
      provider: "istanbul",
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});
