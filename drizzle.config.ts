import { type Config } from 'drizzle-kit';
import { config } from './src/server/config';

export default {
    schema: './src/server/database/schema.ts',
    dialect: 'turso',
    dbCredentials: {
        ...config.database,
    },
} satisfies Config;
