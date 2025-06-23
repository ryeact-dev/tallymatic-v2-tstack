import { z } from 'zod'

// Login Schema
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

// Competition Schema
export const competitionBaseSchema = z.object({
  id: z.string().optional(),
  number: z.coerce
    .number({ invalid_type_error: 'Must be an integer' })
    .gt(0, 'Must be greater than 0'),

  name: z.string().trim().min(1, {
    message: 'Competition name must not be empty.',
  }),

  multiplier: z.coerce
    .number({ invalid_type_error: 'Must be an integer' })
    .gt(0, 'Must be greater than 0'),

  isFinalist: z.boolean(),

  finalists: z.coerce
    .number({ invalid_type_error: 'Must be an integer' })
    .min(0, 'Must be 0 or greater'),
})

export const competitionSchema = competitionBaseSchema.refine(
  (data) => {
    if (data.isFinalist) {
      return data.finalists > 0
    } else {
      return data.finalists === 0
    }
  },
  {
    message: 'Finalists must be greater than 0 for Major Competition',
    path: ['finalists'],
  },
)

export type CompetitionFormValues = z.infer<typeof competitionSchema>

// User Schema
export const userBaseSchema = z.object({
  username: z.string().min(6, 'Username must be atleast 6 characters'),
  fullName: z.string().min(6, 'Full name must be atleast 6 characters'),
  email: z.string().email('Please enter a correct email'),
  role: z.string().min(1, 'Please select a role'),
  isActive: z.boolean(),
  photo: z.string(),
  judgeNumber: z.coerce.number(),
  event: z.object({
    id: z.string(),
    name: z.string().min(3, 'Event name must be at least 3 characters'),
  }),
  competitionIds: z.array(z.string()).optional(),
})

export const userSchema = userBaseSchema.superRefine((data, ctx) => {
  if (
    (data.role === 'judge' || data.role === 'tabulator') &&
    (!data.competitionIds || data.competitionIds.length === 0)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select at least one competition',
      path: ['competitions'],
    })
  }

  if (data.role === 'judge' && data.judgeNumber === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Judge number must be greater than 0',
      path: ['judgeNumber'],
    })
  }
})

export type UserFormValues = z.infer<typeof userBaseSchema>

// Event Schema
export const eventSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(3, 'Event name must be at least 3 characters'),
    eventDate: z.coerce.date(),
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // Only validate eventDate if there's no id (new event)
    if (!data.id && data.eventDate < new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Event date must be after current date',
        path: ['eventDate'],
      })
    }
  })

export type EventFormValues = z.infer<typeof eventSchema>

// Candidate Schema
export const candidateBaseSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  number: z.coerce
    .number({ invalid_type_error: 'Must be an integer' })
    .gt(0, 'Must be greater than 0'),
  course: z.string().min(3, 'Course name must be at least 3 characters'),
  photo: z.string().min(1, 'Photo must be at least 1 character'),
  eventId: z.string().min(1, 'Event ID is required'),
})

export type CandidateFormValues = z.infer<typeof candidateBaseSchema>
