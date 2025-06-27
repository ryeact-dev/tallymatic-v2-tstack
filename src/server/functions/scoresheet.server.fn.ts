import { createServerFn } from '@tanstack/react-start'
import {
  createCandidateScoresDb,
  updateCandidateScoresDb,
} from '../db-access/scoresheet.db.access'
import { authenticatedMiddleware } from '~/utils/middlewares'
import { scoresheetValidationSchema } from '~/zod/validator.schema'

// export const getAllCompetitionsServerFn = createServerFn()
//   .middleware([authenticatedMiddleware])
//   .validator(getAllCompetitionsSchema)
//   .handler(async ({ data }) => {
//     return await getAllCompetitionsDb({
//       page: data.page,
//       limit: data.limit,
//       filter: data.filter || '',
//       eventId: data.eventId,
//     });
//   });

export const createCandidateScoresServerFn = createServerFn({ method: 'POST' })
  .middleware([authenticatedMiddleware])
  .validator(scoresheetValidationSchema)
  .handler(async ({ context, data }) => {
    // if (context.user.role !== 'judge') {
    //   return {
    //     success: false,
    //     message: 'You are not authorized to score a candidate',
    //   }
    // }

    const { id, ...rest } = data

    return await createCandidateScoresDb(rest)
  })

export const updateCandidateScoresServerFn = createServerFn({ method: 'POST' })
  .middleware([authenticatedMiddleware])
  .validator(scoresheetValidationSchema)
  .handler(async ({ context, data }) => {
    // if (context.user.role !== 'judge') {
    //   return {
    //     success: false,
    //     message: 'You are not authorized to score a candidate',
    //   }
    // }

    return await updateCandidateScoresDb(data)
  })

// export const updateCompetitionServerFn = createServerFn({ method: 'POST' })
//   .middleware([authenticatedMiddleware])
//   .validator(createCompetitionSchema)
//   .handler(async ({ data }) => {
//     return await updateCompetitionDb(data);
//   });

// export const toggleCompetitionServerFn = createServerFn({ method: 'POST' })
//   .middleware([authenticatedMiddleware])
//   .validator(toggleCompetitionSchema)
//   .handler(async ({ data }) => {
//     return await toggleCompetitionDb(data);
//   });

// export const deleteCompetitionServerFn = createServerFn({ method: 'POST' })
//   .middleware([authenticatedMiddleware])
//   .validator(z.object({ id: z.string() }))
//   .handler(async ({ data }) => {
//     return await deleteCompetitionDb(data);
//   });
