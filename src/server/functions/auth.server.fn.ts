import { createServerFn } from '@tanstack/react-start';
import {
  getCurrentUserDb,
  loginUserDb,
  logoutUserDb,
} from '~/server/db-access/auth.db.access';
import { loginSchema } from '~/zod/form.schema';
import { deleteSessionTokenCookie, getSessionToken } from '~/utils/session';

// export function getCurrentUserServerFn({
//   sessionToken,
// }: {
//   sessionToken: string;
// }) {
//   return createServerFn().handler(
//     async () => await getCurrentUserDb(sessionToken)
//   );
// }

export const getCurrentUserServerFn = createServerFn().handler(async () => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    console.log('no session token');
    return null;
  }
  const user = await getCurrentUserDb(sessionToken);

  // console.log('server function', user);

  return user;
});

export const loginUserServerFn = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(async ({ data }) => {
    return loginUserDb(data);
  });

export const logoutUserServerFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    return logoutUserDb();
  }
);
