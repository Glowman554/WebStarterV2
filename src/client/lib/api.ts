import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import superjson from 'superjson';
import { DEV } from 'solid-js';
import { AppRouter } from '../../server/api/router';

export const api = createTRPCProxyClient<AppRouter>({
    links: [loggerLink({ enabled: () => !!DEV }), httpBatchLink({ url: '/api/trpc' })],
    transformer: superjson,
});
