import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import type {
  ErrorWithDataResponse,
  UserApiResponse,
  UserLoginCredentials,
} from '~/utils/types'

import ToastNotification from '~/components/toast-notification/ToastNotification'

import {
  getCurrentUserServerFn,
  loginUserServerFn,
  logoutUserServerFn,
} from '~/server/functions/auth.server.fn'

export const authQueries = {
  all: ['auth'] as const,
  user: () =>
    queryOptions({
      queryKey: [...authQueries.all, 'user'],
      queryFn: () => getCurrentUserServerFn(),
      retry: 0,
    }),
}

export function useLoginUserMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    UserApiResponse,
    ErrorWithDataResponse,
    UserLoginCredentials
  >({
    mutationFn: (data: UserLoginCredentials) => loginUserServerFn({ data }),
    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Login Error',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Login Error',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Login Success',
        description: data.message,
      })

      queryClient.setQueryData([...authQueries.all, 'user'], data.user)
    },
  })
}

export function useLogoutUserMutation() {
  const queryClient = useQueryClient()

  return useMutation<UserApiResponse, ErrorWithDataResponse, null>({
    mutationFn: () => logoutUserServerFn(),
    onError: ({ data }) => {
      return ToastNotification({
        color: 'Danger',
        title: 'Login Error',
        description: data.message,
      })
    },
    onSuccess: (data) => {
      if (!data.success) {
        return ToastNotification({
          color: 'Danger',
          title: 'Login Error',
          description: data.message,
        })
      }

      ToastNotification({
        color: 'Success',
        title: 'Login Success',
        description: data.message,
      })

      queryClient.setQueryData([...authQueries.all, 'user'], data.user)
    },
  })
}
