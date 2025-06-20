import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { ApiResponse, ErrorWithDataResponse } from '~/utils/types'
import type { CreateCompetitionValues } from '~/zod/validator.schema'
import ToastNotification from '~/components/toast-notification/ToastNotification'
import {
  createCompetitionServerFn,
  deleteCompetitionServerFn,
  getAllCompetitionsServerFn,
  toggleCompetitionServerFn,
  updateCompetitionServerFn,
} from '~/server/functions/competition.server.fn'

export const competitionQueries = {
  all: ['competitions'] as const,
  list: ({
    page,
    limit,
    filter,
    eventId,
  }: {
    page: number
    limit: number
    filter: string
    eventId: string
  }) =>
    queryOptions({
      queryKey: [...competitionQueries.all, 'list', page, limit, filter],
      queryFn: () =>
        getAllCompetitionsServerFn({ data: { page, limit, filter, eventId } }),
      select: (data) => {
        // Parse the JSON string from server response into an array of objects
        return JSON.parse(data.competitions)
      },
      retry: 0,
    }),
}

export function useCreateCompetitionMutation(
  reset: () => void,
  onClose: () => void,
) {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    CreateCompetitionValues
  >({
    mutationFn: (data) => createCompetitionServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Add competition',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Add competition',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Add competition',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...competitionQueries.all, 'list'],
      })

      // Reset form values
      reset()
      onClose()
    },
  })
}

export function useUpdateCompetitionMutation(
  reset: () => void,
  onClose: () => void,
) {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    CreateCompetitionValues
  >({
    mutationFn: (data) => updateCompetitionServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Competition update',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Competition update',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Competition update',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...competitionQueries.all, 'list'],
      })

      // Reset form values
      reset()
      onClose()
    },
  })
}

export function useToggleCompetitionMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    { id: string; isActive: boolean }
  >({
    mutationFn: (data) => toggleCompetitionServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Competition update',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Competition update',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Competition update',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...competitionQueries.all, 'list'],
      })
    },
  })
}

export function useDeleteCompetitionMutation(onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse, ErrorWithDataResponse, { id: string }>({
    mutationFn: (data) => deleteCompetitionServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Competition delete',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Competition delete',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Competition delete',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...competitionQueries.all, 'list'],
      })

      onClose()
    },
  })
}
