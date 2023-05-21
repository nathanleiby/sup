import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/sup/", // needed for GH Pages deploy
  // server: {
  //   port: 3000,
  // },
});
