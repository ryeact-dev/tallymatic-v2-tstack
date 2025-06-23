import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import type {
  ApiResponse,
  ErrorWithDataResponse,
  QueryParams,
} from '~/utils/types'
import type { CandidateFormValues } from '~/zod/form.schema'
import type { Candidate } from '~/generated/prisma/client'
import type { DeleteBaseType } from '~/zod/validator.schema'

import ToastNotification from '~/components/toast-notification/ToastNotification'
import {
  createCandidateServerFn,
  deleteCandidateServerFn,
  getEventCandidatesServerFn,
  updateCandidateServerFn,
} from '~/server/functions/candidate.server.fn'

export const candidateQueries = {
  all: ['candidates'] as const,
  list: (params: QueryParams) =>
    queryOptions({
      queryKey: [...candidateQueries.all, 'list', params],
      queryFn: () => getEventCandidatesServerFn({ data: params }),
      placeholderData: (previewData) => previewData,
      retry: 0,
    }),
}

export function useCreateCandidateMutation(
  reset: () => void,
  onClose: () => void,
) {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse, ErrorWithDataResponse, CandidateFormValues>({
    mutationFn: (data) => createCandidateServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Add Candidate',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Add Candidate',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Add Candidate',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...candidateQueries.all, 'list'],
      })

      // Reset form values
      reset()
      onClose()
    },
  })
}

export function updateCandidateMutation(
  reset: () => void,
  onClose: () => void,
) {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    Omit<Candidate, 'createdAt'>
  >({
    mutationFn: (data) => updateCandidateServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Event update',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Event update',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Event update',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...candidateQueries.all, 'list'],
      })

      // Reset form values
      reset()
      onClose()
    },
  })
}

export function useDeleteCandidateMutation(onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse, ErrorWithDataResponse, DeleteBaseType>({
    mutationFn: (data) => deleteCandidateServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Candidate delete',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Candidate delete',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Candidate delete',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...candidateQueries.all, 'list'],
      })

      onClose()
    },
  })
}
