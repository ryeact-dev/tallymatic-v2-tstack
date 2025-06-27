import type { ScoresheetFormValues } from '~/zod/validator.schema'
import { prisma } from '~/utils/prisma'

export async function createCandidateScoresDb(
  data: Omit<ScoresheetFormValues, 'id'>,
) {
  try {
    await prisma.scoresheet.create({
      data,
    })

    return {
      success: true,
      message: 'Candidate Scoresheet successfully added.',
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'Error adding candidate scoresheet',
    }
  }
}

export async function updateCandidateScoresDb(data: ScoresheetFormValues) {
  const { id } = data

  try {
    await prisma.scoresheet.update({
      where: {
        id,
      },
      data,
    })

    return {
      success: true,
      message: 'Candidate Scoresheet successfully updated.',
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'Error updating candidate scoresheet',
    }
  }
}
