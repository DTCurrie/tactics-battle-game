import { defineConfig } from "vite";
import { client } from "../ports.json";

export default defineConfig({
  server: {
    port: client,
  },
});
