import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base = process.env.VITE_BASE || "/";
const hmrClientPort = Number(process.env.VITE_HMR_CLIENT_PORT || 5173);

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    hmr: hmrClientPort === 5173 ? undefined : { clientPort: hmrClientPort },
    allowedHosts: true,
  },
});
