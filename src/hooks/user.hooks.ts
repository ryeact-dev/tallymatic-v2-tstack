import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  ApiResponse,
  ErrorWithDataResponse,
  UserWithEventAndCompetitions,
} from '~/utils/types'

import ToastNotification from '~/components/toast-notification/ToastNotification'

import {
  createUserServerFn,
  deleteUserServerFn,
  getAllUsersServerFn,
  resetUserPasswordServerFn,
  toggleUserServerFn,
  updateUserServerFn,
} from '~/server/functions/user.server.fn'

export const userQueries = {
  all: ['users'] as const,
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
      queryKey: [...userQueries.all, 'list', page, limit, filter],
      queryFn: () => getAllUsersServerFn({ data: { page, limit, filter } }),
      select: (data) => {
        // Parse the JSON string from server response into an array of objects
        return JSON.parse(data.users)
      },
      retry: 0,
    }),
}

export function useCreateUserMutation(reset: () => void, onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    UserWithEventAndCompetitions
  >({
    mutationFn: (data) => createUserServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Add user',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Add user',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Add user',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...userQueries.all, 'list'],
      })

      // Reset form values
      reset()
      onClose()
    },
  })
}

export function useUpdateUserMutation(reset: () => void, onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    UserWithEventAndCompetitions
  >({
    mutationFn: (data) => updateUserServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Add user',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Add user',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Add user',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...userQueries.all, 'list'],
      })

      // Reset form values
      reset()
      onClose()
    },
  })
}

export function useResetUserPasswordMutation(onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    { id: string; role: string; newPassword: string }
  >({
    mutationFn: (data) => resetUserPasswordServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Update user status',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Update user status',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Update user status',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...userQueries.all, 'list'],
      })

      onClose()
    },
  })
}

export function useToggleUserMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    { id: string; role: string; isActive: boolean }
  >({
    mutationFn: (data) => toggleUserServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Update user status',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Update user status',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Update user status',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...userQueries.all, 'list'],
      })
    },
  })
}

export function useDeleteUserMutation(onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    { id: string; role: string }
  >({
    mutationFn: (data) => deleteUserServerFn({ data }),

    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Delete user',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Add user error',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Delete user',
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: [...userQueries.all, 'list'],
      })

      onClose()
    },
  })
}
