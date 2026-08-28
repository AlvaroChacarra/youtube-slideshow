import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://alvarochacarra.github.io",
  base: "/youtube-slideshow/",
  output: "static",
  integrations: [react()],
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("gsap")) return "motion-gsap";
            if (id.includes("katex")) return "math-katex";
            if (id.includes("d3-")) return "viz-d3";
            if (id.includes("motion")) return "motion-ui";
          }
        }
      }
    }
  }
});
