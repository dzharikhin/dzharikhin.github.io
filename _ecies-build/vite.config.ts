import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    base: '',
    build: {
        outDir: path.join(__dirname, "../ecies"),
        minify: false,
        rollupOptions: {
            output: {
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`
            }
        }
    },
})