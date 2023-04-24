import { Config } from "tailwindcss";
import { colors } from "@tactics-battle-game/core/colors";

import defaultTheme from "tailwindcss/lib/public/default-theme";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts}",
    "./node_modules/@tactics-battle-game/ui/src/**/*.ts",
  ],

  theme: {
    colors,
    ...(defaultTheme.colors ?? {}),
  },

  plugins: [],
} satisfies Config;
