import { initTRPC } from '@trpc/server';
import { Context } from './express';
import superjson from 'superjson';

export const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const procedure = t.procedure;
