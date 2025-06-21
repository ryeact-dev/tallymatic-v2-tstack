import * as bcrypt from 'bcrypt'
import { verifyToken } from '~/utils/jwt'
import { prisma } from '~/utils/prisma'
import { deleteSessionTokenCookie, setSession } from '~/utils/session'

export async function getCurrentUserDb(sessionToken: string) {
  const decoded = verifyToken(sessionToken)

  if (!decoded || typeof decoded === 'string') {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        event: true,
        competitions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        password: true,
        createdAt: true,
        email: true,
        eventId: true,
      },
    })

    return user
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function loginUserDb(data: {
  username: string
  password: string
}) {
  try {
    const returnResponse = {
      success: false,
      message: '',
      user: null,
    }

    const user = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
      include: {
        event: true,
        competitions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!user) {
      returnResponse.message = 'User not found'
      return returnResponse
    }

    const isPasswordValid = bcrypt.compareSync(data.password, user.password)

    if (!isPasswordValid) {
      returnResponse.message = 'Invalid password'
      return returnResponse
    }

    await setSession(user)

    const { password, ...userData } = user

    return {
      success: true,
      message: 'User logged in successfully',
      user: userData,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error logging in',
      user: null,
    }
  }
}

export async function logoutUserDb() {
  try {
    await deleteSessionTokenCookie()

    return {
      success: true,
      message: 'User logged-out successfully',
      user: null,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error logging out',
      user: null,
    }
  }
}
