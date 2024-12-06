import { z } from 'zod';
import { procedure, router } from './utils';
import { authenticationRouter } from './routers/authentication';

export const appRouter = router({
    authentication: authenticationRouter,
    hello: procedure.input(z.string().nullish()).query(async ({ input }) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return `hello ${input ?? 'world'}`;
    }),
});

export type AppRouter = typeof appRouter;
