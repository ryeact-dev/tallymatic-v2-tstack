import type { UserCompetition } from '~/utils/types'
import { replacer } from '~/helpers/server-helpers'
import { prisma } from '~/utils/prisma'

export async function getEventCompetitionsDb({
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
    const competitions = await prisma.competition.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        AND: [
          {
            name: { contains: filter },
          },
          ...(eventId.trim() ? [{ eventId }] : []),
        ],
      },
      orderBy: {
        number: 'asc',
      },
    })

    // Need to serialize the competitions array to JSON string before returning
    const json = JSON.stringify(competitions, replacer)

    return {
      success: true,
      message: 'Competitions successfully fetched',
      competitions: json,
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Error fetching competitions',
      user: null,
    }
  }
}

export async function createCompetitionDb(competition: UserCompetition) {
  try {
    const foundCompetition = await prisma.competition.findFirst({
      where: {
        AND: [
          {
            eventId: competition.eventId,
            OR: [{ name: competition.name }, { number: competition.number }],
          },
        ],
      },
    })

    if (foundCompetition) {
      return {
        success: false,
        message: 'Competition name/number already exists',
      }
    }

    const newCompetition = await prisma.competition.create({
      data: {
        number: competition.number,
        name: competition.name,
        multiplier: competition.multiplier,
        finalists: competition.finalists,
        isFinalist: competition.isFinalist,
        criteria: competition.criteria as Array<Record<string, any>>,
        eventId: competition.eventId,
      },
    })

    console.log(`Competition ${newCompetition.name} successfully created`)

    return {
      success: true,
      message: 'Competiton created successfully',
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'Error updating competition',
      user: null,
    }
  }
}

export async function updateCompetitionDb(competition: UserCompetition) {
  try {
    const foundCompetition = await prisma.competition.findFirst({
      where: {
        AND: [
          {
            eventId: competition.eventId,
            OR: [{ name: competition.name }, { number: competition.number }],
          },
        ],
      },
    })

    if (foundCompetition && foundCompetition.id !== competition.id) {
      return {
        success: false,
        message: 'Competition name/number already exists',
      }
    }

    const newCompetition = await prisma.competition.update({
      where: {
        id: competition.id,
      },
      data: {
        number: competition.number,
        name: competition.name,
        multiplier: competition.multiplier,
        finalists: competition.finalists,
        isFinalist: competition.isFinalist,
        criteria: competition.criteria as Array<Record<string, any>>,
      },
    })

    console.log(`Competition ${newCompetition.name} successfully updated`)

    return {
      success: true,
      message: 'Competiton successfully updated',
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'Error updating competition',
      user: null,
    }
  }
}

export async function toggleCompetitionDb({
  id,
  isActive,
}: {
  id: string
  isActive: boolean
}) {
  try {
    const [toggledCompetition, _] = await prisma.$transaction([
      prisma.competition.update({
        where: {
          id,
        },
        data: {
          isActive,
        },
      }),
      prisma.competition.updateMany({
        where: {
          id: {
            notIn: [id],
          },
        },
        data: {
          isActive: false,
        },
      }),
    ])

    console.log(
      `Competition ${toggledCompetition.name} successfully was ${toggledCompetition.isActive ? 'activated' : 'deactivated'}`,
    )

    return {
      success: true,
      message: 'Competiton successfully updated',
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'Error updating competition',
      user: null,
    }
  }
}

export async function deleteCompetitionDb({ id }: { id: string }) {
  try {
    const deletedCompetition = await prisma.competition.delete({
      where: {
        id,
      },
    })

    console.log(`Competition ${deletedCompetition.name} successfully deleted`)

    return {
      success: true,
      message: 'Competiton successfully deleted',
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'Error deleting competition',
      user: null,
    }
  }
}
