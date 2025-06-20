import { getCookie, setCookie } from '@tanstack/react-start/server'
import { generateToken, verifyToken } from './jwt'
import type { User } from '~/generated/prisma/client'

const SESSION_COOKIE_NAME = 'tallymatic_session'

export async function setSessionTokenCookie(
  token: string,
  //   expiresAt: Date
): Promise<void> {
  setCookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    // expires: expiresAt,
    path: '/',
  })
}

export async function deleteSessionTokenCookie(): Promise<void> {
  setCookie(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  })
}

// export const createSession = (user: User) => {
//   const token = generateToken({
//     id: user.id,

//   });

//   return {
//     token,
//     user: {
//       id: user.id,
//       email: user.email,
//       role: user.role,
//       fullName: user.fullName
//     }
//   };
// };

export const validateSession = (token: string) => {
  const decoded = verifyToken(token)
  if (!decoded) return null
  return decoded
}

export async function getSessionToken(): Promise<string | undefined> {
  const sessionCookie = getCookie(SESSION_COOKIE_NAME)
  return sessionCookie
}

export async function setSession(user: User) {
  //   const token = generateSessionToken();
  //   const session =  createSession(user);

  const token = generateToken({
    id: user.id,
  })
  await setSessionTokenCookie(token)
}
