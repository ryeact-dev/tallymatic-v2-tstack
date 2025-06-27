import { z } from 'zod'
import {
  candidateBaseSchema,
  competitionBaseSchema,
  userBaseSchema,
} from './form.schema'

// Base Validation Schema
export const baseValidationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(10),
  filter: z.string().optional(),
})

export const idBaseSchema = z.object({
  id: z.string().min(3, 'User ID is required'),
})

export type IdBaseType = z.infer<typeof idBaseSchema>

// Event Validation Schema
export const updateEventSchema = z.object({
  id: z.string().min(3, 'Event ID is required'),
  name: z.string().min(3, 'Username must be at least 3 characters'),
  eventDate: z.coerce.date(),
  isActive: z.boolean(),
})

// User Validation Schema
export const usersListSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(10),
  filter: z.string().optional(),
})

export const createUserSchema = userBaseSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const updateUserSchema = userBaseSchema.extend({
  id: z.string().min(3, 'User ID is required'),
})

export const deleteUserSchema = z.object({
  id: z.string().min(6, 'User ID is required'),
  role: z.string().min(1, 'User role is required'),
})

export const toggleUserSchema = z.object({
  id: z.string().min(6, 'User ID is required'),
  role: z.string().min(1, 'User role is required'),
  isActive: z.boolean(),
})

export const resetUserPasswordSchema = z.object({
  id: z.string().min(6, 'User ID is required'),
  role: z.string().min(1, 'User role is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

// Competition Validation Schema
export const createCompetitionSchema = competitionBaseSchema.extend({
  eventId: z.string().min(3, 'Event ID is required'),
  criteria: z.array(
    z.object({
      criteriaTitle: z.string(),
      percent: z.number().positive(),
      score: z.number(),
    }),
  ),
  isActive: z.boolean(),
})

export type CreateCompetitionValues = z.infer<typeof createCompetitionSchema>

export const toggleCompetitionSchema = z.object({
  id: z.string().min(6, 'User ID is required'),
  isActive: z.boolean(),
})

export const getAllCompetitionsSchema = baseValidationSchema.extend({
  eventId: z.string().optional(),
})

// Candidate Validation Schema
export const candidateValidationSchema = candidateBaseSchema.extend({
  id: z.string().min(1, 'Candidate ID is required'),
})

// Scoresheet Validation Schema
export const scoresheetValidationSchema = z.object({
  id: z.string().optional(),
  scores: z.array(
    z.object({
      score: z.number(),
      criteriaTitle: z.string(),
      percent: z.number().positive(),
    }),
  ),
  userId: z.string().min(1, 'User ID is required'),
  candidateId: z.string().min(1, 'Candidate ID is required'),
  competitionId: z.string().min(1, 'Competition ID is required'),
  total: z.number().positive(),
})

export type ScoresheetFormValues = z.infer<typeof scoresheetValidationSchema>
