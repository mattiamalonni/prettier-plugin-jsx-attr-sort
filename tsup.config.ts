import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  platform: "node",
  target: "node18",
  external: [
    "prettier",
    "@babel/parser",
    "@babel/types",
    "@babel/generator",
    "@babel/traverse",
  ],
});
