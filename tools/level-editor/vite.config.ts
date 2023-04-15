import { defineConfig } from "vite";
import { levelCreator } from "../../ports.json";

export default defineConfig({
  server: {
    port: 8081,
    strictPort: true,
  },
});
