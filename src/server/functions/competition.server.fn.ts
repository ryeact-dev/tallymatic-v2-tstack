import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import {
  createCompetitionDb,
  deleteCompetitionDb,
  getAllCompetitionsDb,
  toggleCompetitionDb,
  updateCompetitionDb,
} from '../db-access/competition.db.access'

import { authenticatedMiddleware } from '~/utils/middlewares'
import {
  createCompetitionSchema,
  getAllCompetitionsSchema,
  toggleCompetitionSchema,
} from '~/zod/validator.schema'

export const getAllCompetitionsServerFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(getAllCompetitionsSchema)
  .handler(async ({ data }) => {
    return await getAllCompetitionsDb({
      page: data.page,
      limit: data.limit,
      filter: data.filter || '',
      eventId: data.eventId,
    })
  })

export const createCompetitionServerFn = createServerFn({ method: 'POST' })
  .middleware([authenticatedMiddleware])
  .validator(createCompetitionSchema)
  .handler(async ({ data }) => {
    return await createCompetitionDb(data)
  })

export const updateCompetitionServerFn = createServerFn({ method: 'POST' })
  .middleware([authenticatedMiddleware])
  .validator(createCompetitionSchema)
  .handler(async ({ data }) => {
    return await updateCompetitionDb(data)
  })

export const toggleCompetitionServerFn = createServerFn({ method: 'POST' })
  .middleware([authenticatedMiddleware])
  .validator(toggleCompetitionSchema)
  .handler(async ({ data }) => {
    return await toggleCompetitionDb(data)
  })

export const deleteCompetitionServerFn = createServerFn({ method: 'POST' })
  .middleware([authenticatedMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    return await deleteCompetitionDb(data)
  })
