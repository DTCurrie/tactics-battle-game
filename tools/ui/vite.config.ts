import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "UI",
      fileName: "ui",
    },
    rollupOptions: {
      external: ["three"],
      output: {
        globals: {
          three: "three",
        },
      },
    },
  },
});
