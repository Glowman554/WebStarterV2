import { z } from 'zod';
import { validateOrThrow } from './validation';
import { readFileSync } from 'fs';

const schema = z.object({
    database: z.object({ authToken: z.string().optional(), url: z.string() }),
});

export const config = validateOrThrow(schema, JSON.parse(new TextDecoder().decode(readFileSync('config.json'))));
