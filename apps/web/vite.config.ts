import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    fs: {
      // Izinkan Vite serve file dari workspace packages
      allow: [path.resolve(__dirname, "../../packages")],
    },
  },
});
