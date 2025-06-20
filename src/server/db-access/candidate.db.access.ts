import * as bcrypt from 'bcrypt'
import type { CandidateNoCreatedAt } from '~/utils/types'
import { prisma } from '~/utils/prisma'

// export async function getCurrentUserDb(sessionToken: string) {
//   const decoded = verifyToken(sessionToken);

//   if (!decoded || typeof decoded === 'string') {
//     return null;
//   }

//   const user = await prisma.user.findUnique({
//     where: {
//       id: decoded.id,
//     },
//     include: {
//       event: true,
//       competitions: {
//         select: {
//           id: true,
//           name: true,
//         },
//       },
//     },
//     omit: {
//       password: true,
//       createdAt: true,
//       email: true,
//       eventId: true,
//     },
//   });

//   return user;
// }

export async function createCandidateDb(
  candidate: Omit<CandidateNoCreatedAt, 'id'>,
) {
  try {
    const foundCandidate = await prisma.candidate.findFirst({
      where: {
        AND: [
          {
            eventId: candidate.eventId,
            OR: [
              { fullName: candidate.fullName },
              { number: candidate.number },
            ],
          },
        ],
      },
    })

    if (foundCandidate) {
      return {
        success: false,
        message: 'Candidate name/number already exists',
      }
    }

    const newCandidate = await prisma.candidate.create({
      data: {
        fullName: candidate.fullName,
        number: candidate.number,
        course: candidate.course,
        photo: candidate.photo,
        eventId: candidate.eventId,
      },
    })

    console.log(`Candidate ${newCandidate.fullName} successfully added`)

    return {
      success: true,
      message: 'User logged in successfully',
      // can: userData,
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
