import { users, sessions } from '~/server/database/schema';
import { procedure, router } from '../utils';
import { db } from '~/server/database/database';
import { eq, InferSelectModel } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { compareSync, hashSync } from '@node-rs/bcrypt';
import { passwordOk, validatePassword } from '~/lib/password';
import { Context } from '../express';

export type User = Omit<InferSelectModel<typeof users>, 'passwordHash'>;

function getToken(ctx: Context) {
    const cookies = ctx.req.cookies;
    if (cookies) {
        return cookies['token'];
    }
    return undefined;
}

function setToken(ctx: Context, token: string) {
    ctx.res.cookie('token', token);
}

async function createSession(username: string) {
    const token = randomBytes(48).toString('base64');
    await db.insert(sessions).values({ token, username });
    return token;
}

export async function authenticate(ctx: Context) {
    const token = getToken(ctx);
    if (!token) {
        return undefined;
    }

    const user = await db
        .select({
            username: users.username,
        })
        .from(sessions)
        .where(eq(sessions.token, token))
        .innerJoin(users, eq(sessions.username, users.username))
        .get();
    return user satisfies User | undefined;
}

export async function permission(ctx: Context, check: (u: User) => boolean) {
    const user = await authenticate(ctx);
    if (!user) {
        throw new Error('Not logged in');
    }

    if (!check(user)) {
        throw new Error('Missing permission');
    }

    return user;
}

export const authenticationRouter = router({
    status: procedure.query(async ({ ctx }) => {
        return await authenticate(ctx);
    }),

    login: procedure
        .input(z.object({ username: z.string(), password: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const user = await db.select().from(users).where(eq(users.username, input.username)).get();
            if (!user || !compareSync(input.password, user.passwordHash)) {
                throw new Error('Invalid username or password');
            }

            const token = await createSession(input.username);
            setToken(ctx, token);
        }),

    changePassword: procedure
        .input(z.object({ oldPassword: z.string(), newPassword: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const user = await permission(ctx, () => true);

            if (!passwordOk(validatePassword(input.newPassword))) {
                throw new Error('Password not strong enough');
            }

            const loaded = await db
                .select({ passwordHash: users.passwordHash })
                .from(users)
                .where(eq(users.username, user.username))
                .get();

            if (!compareSync(input.oldPassword, loaded!.passwordHash)) {
                throw new Error('Invalid old password');
            }

            await db
                .update(users)
                .set({ passwordHash: hashSync(input.newPassword) })
                .where(eq(users.username, user.username));

            await db.delete(sessions).where(eq(sessions.username, user.username));
        }),
});
