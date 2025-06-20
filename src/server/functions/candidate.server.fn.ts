import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { authenticatedMiddleware } from '~/utils/middlewares';
import {
  createCompetitionSchema,
  updateEventSchema,
  getAllCompetitionsSchema,
  toggleCompetitionSchema,
} from '~/zod/validator.schema';
import {
  createCompetitionDb,
  deleteCompetitionDb,
  getAllCompetitionsDb,
  toggleCompetitionDb,
  updateCompetitionDb,
} from '../db-access/competition.db.access';
import { candidateBaseSchema } from '~/zod/form.schema';
import { createCandidateDb } from '../db-access/candidate.db.access';

export const getAllCompetitionsServerFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(getAllCompetitionsSchema)
  .handler(async ({ data }) => {
    return await getAllCompetitionsDb({
      page: data.page,
      limit: data.limit,
      filter: data.filter || '',
      eventId: data.eventId,
    });
  });

export const createCandidateServerFn = createServerFn({ method: 'POST' })
  .middleware([authenticatedMiddleware])
  .validator(candidateBaseSchema)
  .handler(async ({ data }) => {
    return await createCandidateDb(data);
  });

export const updateCompetitionServerFn = createServerFn({ method: 'POST' })
  .middleware([authenticatedMiddleware])
  .validator(createCompetitionSchema)
  .handler(async ({ data }) => {
    return await updateCompetitionDb(data);
  });

export const toggleCompetitionServerFn = createServerFn({ method: 'POST' })
  .middleware([authenticatedMiddleware])
  .validator(toggleCompetitionSchema)
  .handler(async ({ data }) => {
    return await toggleCompetitionDb(data);
  });

export const deleteCompetitionServerFn = createServerFn({ method: 'POST' })
  .middleware([authenticatedMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    return await deleteCompetitionDb(data);
  });
