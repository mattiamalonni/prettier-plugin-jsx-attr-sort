import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.{test,spec}.{js,ts}", "test/**/index.ts"],
  },
});
