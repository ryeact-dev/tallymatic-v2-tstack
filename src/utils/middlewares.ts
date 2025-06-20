import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import type { CurrentUser } from './types'
import { getCurrentUserServerFn } from '~/server/functions/auth.server.fn'

export function isAdmin(user: CurrentUser | null) {
  return user?.role === 'admin'
}

export const logMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next, context, functionId }) => {
    const now = Date.now()

    const result = await next()

    const duration = Date.now() - now
    console.log('Server Req/Res:', { duration: `${duration}ms`, functionId })

    return result
  },
)

export const authenticatedMiddleware = createMiddleware({ type: 'function' })
  .middleware([logMiddleware])
  .server(async ({ next, data }) => {
    const user = await getCurrentUserServerFn()

    if (!user) {
      throw redirect({ to: '/unauthenticated' })
    }

    console.log(`user: ${user.fullName}`)

    return next({
      context: { user, data },
    })
  })

export const adminMiddleware = createMiddleware({ type: 'function' })
  .middleware([logMiddleware])
  .server(async ({ next }) => {
    const user = await getCurrentUserServerFn()

    if (!user) {
      throw redirect({ to: '/unauthenticated' })
    }

    console.log(`user: ${user.fullName}`)

    if (!isAdmin(user)) {
      throw redirect({ to: '/unauthorized' })
    }

    console.log(`admin: ${user.fullName}`)

    return next({ context: { userId: user.id } })
  })
