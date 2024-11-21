import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import json5Plugin from "vite-plugin-json5";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), json5Plugin()],
});
