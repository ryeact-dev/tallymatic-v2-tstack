import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { candidateQueries } from './candidate.hook'

import type {
  ApiResponse,
  ErrorWithDataResponse,
  QueryParams,
  UserWithEventAndCompetitions,
} from '~/utils/types'

import type { ScoresheetFormValues } from '~/zod/validator.schema'

import ToastNotification from '~/components/toast-notification/ToastNotification'

import {
  deleteUserServerFn,
  getAllUsersServerFn,
  resetUserPasswordServerFn,
  toggleUserServerFn,
  updateUserServerFn,
} from '~/server/functions/user.server.fn'
import {
  createCandidateScoresServerFn,
  updateCandidateScoresServerFn,
} from '~/server/functions/scoresheet.server.fn'

export const userQueries = {
  all: ['users'] as const,
  list: (params: QueryParams) =>
    queryOptions<Array<UserWithEventAndCompetitions>>({
      queryKey: [...userQueries.all, 'list', params],
      queryFn: () => getAllUsersServerFn({ data: params }),
      placeholderData: (previewData) => previewData,
      retry: 0,
    }),
}

export function useCreateCandidateScoresMutation(onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse, ErrorWithDataResponse, ScoresheetFormValues>({
    mutationFn: (data) => createCandidateScoresServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Add scoresheet',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Add scoresheet',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Add scoresheet',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...candidateQueries.all, 'list'],
      })

      // Reset form values
      onClose()
    },
  })
}

export function useUpdateCandidateScoresMutation(onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse, ErrorWithDataResponse, ScoresheetFormValues>({
    mutationFn: (data) => updateCandidateScoresServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Update scoresheet',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Update scoresheet',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Update scoresheet',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...candidateQueries.all, 'list'],
      })

      // Reset form values
      onClose()
    },
  })
}
