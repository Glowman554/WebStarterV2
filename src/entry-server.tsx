import { renderToString } from 'solid-js/web';
import App from './client/App';
import express from 'express';
import { addTRPC } from './server/api/express';
import { db } from './server/database/database';
import { users } from './server/database/schema';
import { hashSync } from '@node-rs/bcrypt';

export function render(url: string) {
    const html = renderToString(() => <App url={url} />);
    return { html };
}

export function init(app: express.Express) {
    addTRPC(app);

    db.insert(users)
        .values({
            username: 'admin',
            passwordHash: hashSync('admin'),
        })
        .onConflictDoNothing()
        .then(console.log);
}
