import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import {
  createCompetitionDb,
  deleteCompetitionDb,
  getEventCompetitionsDb,
  getSingleCompetitionDb,
  toggleCompetitionDb,
  updateCompetitionDb,
} from '../db-access/competition.db.access'

import { authenticatedMiddleware } from '~/utils/middlewares'
import {
  createCompetitionSchema,
  getAllCompetitionsSchema,
  idBaseSchema,
  toggleCompetitionSchema,
} from '~/zod/validator.schema'

export const getAllCompetitionsServerFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(getAllCompetitionsSchema)
  .handler(async ({ data }) => {
    const res = await getEventCompetitionsDb({
      page: data.page,
      limit: data.limit,
      filter: data.filter || '',
      eventId: data.eventId || '',
    })

    // Parse the JSON string from server response into an array of objects
    return JSON.parse(res.competitions || '')
  })

export const getSingleCompetitionsServerFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(idBaseSchema)
  .handler(async ({ data }) => {
    const res = await getSingleCompetitionDb(data.id)

    // Parse the JSON string from server response into an array of objects
    return JSON.parse(res.competition || '')
    // return res.competition
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
