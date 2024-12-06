import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths(), solid({ ssr: true })],
    build: { minify: 'esbuild' },
});
