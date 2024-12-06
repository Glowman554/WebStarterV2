import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './router';

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({ req, res });
export type Context = Awaited<ReturnType<typeof createContext>>;

export function addTRPC(app: express.Express) {
    app.use(
        '/api/trpc',
        trpcExpress.createExpressMiddleware({
            router: appRouter,
            createContext,
        })
    );
}
