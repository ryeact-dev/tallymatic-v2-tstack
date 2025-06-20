import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { ApiResponse, ErrorWithDataResponse } from '~/utils/types'
import type { CandidateFormValues } from '~/zod/form.schema'
import ToastNotification from '~/components/toast-notification/ToastNotification'
import { getAllEventsServerFn } from '~/server/functions/event.server.fn'
import { createCandidateServerFn } from '~/server/functions/candidate.server.fn'

export const candidateQueries = {
  all: ['candidates'] as const,
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
      queryKey: [...candidateQueries.all, 'list', page, limit, filter],
      queryFn: () => getAllEventsServerFn({ data: { page, limit, filter } }),
      select: (data) => data.events,
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

// export function useUpdateEventMutation(reset: () => void, onClose: () => void) {
//   const queryClient = useQueryClient();

//   return useMutation<
//     ApiResponse,
//     ErrorWithDataResponse,
//     Omit<Event, 'createdAt'>
//   >({
//     mutationFn: (data) => updateEventServerFn({ data }),

//     onError: ({ data }) => {
//       return ToastNotification({
//         color: 'Danger',
//         title: 'Event update',
//         description: data.message,
//       });
//     },
//     onSuccess: (data) => {
//       if (!data.success) {
//         return ToastNotification({
//           color: 'Danger',
//           title: 'Event update',
//           description: data.message,
//         });
//       }

//       ToastNotification({
//         color: 'Success',
//         title: 'Event update',
//         description: data.message,
//       });

//       queryClient.invalidateQueries({
//         queryKey: [...eventQueries.all, 'list'],
//       });

//       // Reset form values
//       reset();
//       onClose();
//     },
//   });
// }

// export function useDeleteEventMutation(onClose: () => void) {
//   const queryClient = useQueryClient();

//   return useMutation<ApiResponse, ErrorWithDataResponse, { id: string }>({
//     mutationFn: (data) => deleteEventServerFn({ data }),

//     onError: ({ data }) => {
//       return ToastNotification({
//         color: 'Danger',
//         title: 'Event delete',
//         description: data.message,
//       });
//     },
//     onSuccess: (data) => {
//       if (!data.success) {
//         return ToastNotification({
//           color: 'Danger',
//           title: 'Event delete',
//           description: data.message,
//         });
//       }

//       ToastNotification({
//         color: 'Success',
//         title: 'Event delete',
//         description: data.message,
//       });

//       queryClient.invalidateQueries({
//         queryKey: [...eventQueries.all, 'list'],
//       });

//       onClose();
//     },
//   });
// }
