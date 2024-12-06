import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { config } from '../config';

import * as schema from './schema';

export const client = createClient({ ...config.database });
export const db = drizzle(client, { schema });
