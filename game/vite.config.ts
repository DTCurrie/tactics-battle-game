import { defineConfig } from "vite";
import { game } from "../ports.json";

export default defineConfig({
  server: {
    port: game,
  },
});
