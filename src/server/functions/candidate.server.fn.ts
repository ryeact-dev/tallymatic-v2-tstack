import { createServerFn } from '@tanstack/react-start'

import {
  createCandidateDb,
  getEventCandidatesDb,
  updateCandidateDb,
} from '../db-access/candidate.db.access'
import { authenticatedMiddleware } from '~/utils/middlewares'
import {
  candidateValidationSchema,
  getAllCompetitionsSchema,
} from '~/zod/validator.schema'
import { candidateBaseSchema } from '~/zod/form.schema'

export const getEventCandidatesServerFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(getAllCompetitionsSchema)
  .handler(async ({ data }) => {
    const res = await getEventCandidatesDb({
      page: data.page,
      limit: data.limit,
      filter: data.filter || '',
      eventId: data.eventId || '',
    })

    return res.candidates
  })

export const createCandidateServerFn = createServerFn({ method: 'POST' })
  .middleware([authenticatedMiddleware])
  .validator(candidateBaseSchema)
  .handler(async ({ data }) => {
    return await createCandidateDb(data)
  })

export const updateCandidateServerFn = createServerFn({ method: 'POST' })
  .middleware([authenticatedMiddleware])
  .validator(candidateValidationSchema)
  .handler(async ({ data }) => {
    return await updateCandidateDb(data)
  })
