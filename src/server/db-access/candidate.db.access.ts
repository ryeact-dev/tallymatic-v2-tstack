import type { CandidateNoCreatedAt } from '~/utils/types'
import type { DeleteBaseType } from '~/zod/validator.schema'
import { prisma } from '~/utils/prisma'

export async function getEventCandidatesDb({
  page,
  limit,
  filter,
  eventId,
}: {
  page: number
  limit: number
  filter: string
  eventId: string
}) {
  try {
    const candidates = await prisma.candidate.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        fullName: { contains: filter },
        eventId,
      },
      orderBy: {
        number: 'asc',
      },
    })
    // Need to serialize the competitions array to JSON string before returning
    // const json = JSON.stringify(competitions, replacer)

    return {
      success: true,
      message: 'Candidates successfully fetched',
      candidates,
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Error fetching candidates',
      candidates: null,
    }
  }
}

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
      message: 'Candidate added successfully',
      // can: userData,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error creating candidate',
      // candidarte: null,
    }
  }
}

export async function updateCandidateDb(candidate: CandidateNoCreatedAt) {
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
    if (foundCandidate && foundCandidate.id !== candidate.id) {
      return {
        success: false,
        message: 'Candidate name/number already exists',
      }
    }
    const newCandidate = await prisma.candidate.update({
      where: {
        id: candidate.id,
      },
      data: {
        fullName: candidate.fullName,
        number: candidate.number,
        course: candidate.course,
        photo: candidate.photo,
        eventId: candidate.eventId,
      },
    })
    console.log(`Candidate ${newCandidate.fullName} successfully updated`)
    return {
      success: true,
      message: 'Candidate updated successfully',
      // can: userData,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error updating candiddate',
      // candidate: null,
    }
  }
}

export async function deleteCandidateDb(data: DeleteBaseType) {
  try {
    const deletedCandidate = await prisma.candidate.delete({
      where: {
        id: data.id,
      },
    })

    console.log(`Candidate ${deletedCandidate.fullName} successfully deleted`)

    return {
      success: true,
      message: 'Candidate deleted successfully',
      // candidate: deletedCandidate,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error deleting candidate',
      // candidate: null,
    }
  }
}
