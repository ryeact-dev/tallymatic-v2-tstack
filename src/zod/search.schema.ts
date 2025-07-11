import { z } from 'zod'

export const searchSchema = z.object({
  page: z.number().catch(1),
  limit: z.number().catch(10),
  filter: z.string().catch(''),
  sort: z.enum(['a-z', 'z-a']).catch('a-z'),
})

export const userSearchSchema = searchSchema.extend({
  tab: z.enum(['judges', 'managers']).catch('judges'),
})

export const competitionSearchSchema = z.object({
  filter: z.string().catch(''),
})
// export type EventSearch = z.infer<typeof eventSearchSchema>;
