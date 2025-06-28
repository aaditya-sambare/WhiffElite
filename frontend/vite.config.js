import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // or vue if you're using Vue

export default defineConfig({
  plugins: [react()],
});
