// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config

export default defineConfig({
  // Enable SSR mode
  output: "server",

  site: "https://lpcvai.github.io",
  integrations: [react()],
});