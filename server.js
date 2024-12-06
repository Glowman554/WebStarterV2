import fs from 'node:fs/promises';
import express from 'express';
import cookieParser from 'cookie-parser';
import { generateHydrationScript } from 'solid-js/web';

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;

const templateHtml = isProduction
    ? await fs.readFile('./dist/client/index.html', 'utf-8')
    : await fs.readFile('./index.html', 'utf-8');

const app = express();
app.use(cookieParser());

/** @type {import('vite').ViteDevServer | undefined} */
let vite;
let init;

if (!isProduction) {
    const { createServer } = await import('vite');
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base: '/',
    });

    (await vite.ssrLoadModule('/src/entry-server.tsx')).init(app);

    app.use(vite.middlewares);
} else {
    const compression = (await import('compression')).default;
    const sirv = (await import('sirv')).default;

    app.use(compression());
    (await import('./dist/server/entry-server.js')).init(app);

    app.use('/', sirv('./dist/client', { extensions: [] }));
}

app.use('*all', async (req, res) => {
    try {
        const url = req.originalUrl;

        let template = isProduction ? templateHtml : await vite.transformIndexHtml(url, templateHtml);
        let render = isProduction
            ? (await import('./dist/server/entry-server.js')).render
            : (await vite.ssrLoadModule('/src/entry-server.tsx')).render;

        const rendered = await render(url);
        const head = (rendered.head ?? '') + generateHydrationScript();
        const html = template.replace(`<!--app-head-->`, head).replace(`<!--app-html-->`, rendered.html ?? '');

        res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (error) {
        vite?.ssrFixStacktrace(error);
        console.error(error.stack);
        res.status(500).end(error.stack);
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
