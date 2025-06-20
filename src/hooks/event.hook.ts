import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { EventFormValues } from '~/zod/form.schema'
import type { ApiResponse, ErrorWithDataResponse } from '~/utils/types'
import type { Event } from '~/generated/prisma/client'
import ToastNotification from '~/components/toast-notification/ToastNotification'
import {
  createEventServerFn,
  deleteEventServerFn,
  getAllEventsServerFn,
  updateEventServerFn,
} from '~/server/functions/event.server.fn'

export const eventQueries = {
  all: ['events'] as const,
  list: ({
    page,
    limit,
    filter,
  }: {
    page: number
    limit: number
    filter: string
  }) =>
    queryOptions({
      queryKey: [...eventQueries.all, 'list', page, limit, filter],
      queryFn: () => getAllEventsServerFn({ data: { page, limit, filter } }),
      select: (data) => data.events,
      retry: 0,
    }),
}

export function useCreateEventMutation(reset: () => void, onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse, ErrorWithDataResponse, EventFormValues>({
    mutationFn: (data) => createEventServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Add event',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Add event',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Add event',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...eventQueries.all, 'list'],
      })

      // Reset form values
      reset()
      onClose()
    },
  })
}

export function useUpdateEventMutation(reset: () => void, onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    Omit<Event, 'createdAt'>
  >({
    mutationFn: (data) => updateEventServerFn({ data }),

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
        queryKey: [...eventQueries.all, 'list'],
      })

      // Reset form values
      reset()
      onClose()
    },
  })
}

export function useDeleteEventMutation(onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse, ErrorWithDataResponse, { id: string }>({
    mutationFn: (data) => deleteEventServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Event delete',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Event delete',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Event delete',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...eventQueries.all, 'list'],
      })

      onClose()
    },
  })
}
