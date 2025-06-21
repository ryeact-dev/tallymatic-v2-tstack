import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import type { SVGProps } from 'react'
import CompetitionList from '~/components/settings/competitions/competition-list/CompetitionList'
import { searchSchema } from '~/zod/search.schema'
import { competitionQueries } from '~/hooks/competition.hook'
import { debounce } from '~/utils/debounce'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''
}

export const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'AGE', uid: 'age', sortable: true },
  { name: 'ROLE', uid: 'role', sortable: true },
  { name: 'TEAM', uid: 'team' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
]

export const statusOptions = [
  { name: 'Active', uid: 'active' },
  { name: 'Paused', uid: 'paused' },
  { name: 'Vacation', uid: 'vacation' },
]

export const Route = createFileRoute('/settings/competitions')({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { page, filter } }) => ({ page, filter }),
  loader: async ({ context, deps: { filter, page } }) => {
    await context.queryClient.ensureQueryData(
      competitionQueries.list({
        page: Number(page),
        limit: 20,
        filter,
        eventId: context.user?.event?.id || '',
      }),
    )

    return { user: context.user }
  },

  head: () => ({
    meta: [{ title: 'Tallymatic | Settings - Competitions' }],
  }),

  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { user } = Route.useRouteContext()

  const { filter, page, sort } = Route.useSearch()
  const { data: competitions } = useSuspenseQuery(
    competitionQueries.list({
      page: Number(page),
      limit: 20,
      filter,
      eventId: user?.event?.id || '',
    }),
  )

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        navigate({ to: '.', search: { page: 1, filter: value, sort } })
      }, 300),
    [navigate, sort],
  )

  // Use it in your search handler
  const onSearchChangeHandler = useCallback(
    (value?: string) => {
      if (value) {
        debouncedSearch(value)
      } else {
        navigate({ to: '.', search: { page: 1, filter: '', sort } })
      }
    },
    [debouncedSearch, page, sort],
  )

  const onClearHandler = useCallback(() => {
    navigate({ to: '.', search: { page: 1, filter: '', sort } })
  }, [])

  return (
    <>
      <CompetitionList
        competitions={competitions}
        onSearchChangeHandler={onSearchChangeHandler}
        onClearHandler={onClearHandler}
        filter={filter}
      />
    </>
  )
}
