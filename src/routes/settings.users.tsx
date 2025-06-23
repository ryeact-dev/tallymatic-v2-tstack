import { Tab, Tabs } from '@heroui/tabs'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CalculatorIcon, ClipboardListIcon } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import type { UserWithEventAndCompetitions } from '~/utils/types'
import EventMangersList from '~/components/settings/users/event-managers-list/EventMangersList'
import JudgesTabulatorsList from '~/components/settings/users/judge-tabulators-list/JudgesTabulatorsList'
import { eventQueries } from '~/hooks/event.hook'
import { userQueries } from '~/hooks/user.hooks'
import { userSearchSchema } from '~/zod/search.schema'
import { debounce } from '~/utils/debounce'

type userTabOptions = 'judges' | 'managers'

export const Route = createFileRoute('/settings/users')({
  validateSearch: (search) => userSearchSchema.parse(search),
  loaderDeps: ({ search: { page, filter } }) => ({ page, filter }),
  loader: async ({ context, deps: { filter, page } }) => {
    await context.queryClient.ensureQueryData(
      userQueries.list({
        page,
        limit: 20,
        filter,
      }),
    )

    if (context.user?.role === 'admin') {
      const events = await context.queryClient.ensureQueryData(
        eventQueries.list({
          page: 1,
          limit: 20,
          filter: '',
        }),
      )

      return { events }
    }
  },

  head: () => ({
    meta: [{ title: 'Tallymatic | Settings - Users' }],
  }),

  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { user } = Route.useRouteContext()

  const { filter, page, tab, sort, limit } = Route.useSearch()
  const { data: users } = useSuspenseQuery(
    userQueries.list({
      page: Number(page),
      limit: 20,
      filter,
    }),
  )

  const onTabChangeHandler = useCallback(
    (tabKey: userTabOptions) => {
      navigate({
        to: '.',
        search: { page: 1, tab: tabKey, filter, sort, limit },
      })
    },
    [navigate],
  )

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        navigate({
          to: '.',
          search: { page: 1, tab, filter: value, sort, limit },
        })
      }, 300),
    [navigate, sort],
  )

  // Use it in your search handler
  const onSearchChangeHandler = useCallback(
    (value?: string) => {
      if (value) {
        debouncedSearch(value)
      } else {
        navigate({
          to: '.',
          search: { page: 1, tab, filter: value, sort, limit },
        })
      }
    },
    [debouncedSearch, page, sort],
  )

  const onClearHandler = useCallback(() => {
    navigate({ to: '.', search: { page: 1, tab, filter: '', sort, limit } })
  }, [])

  const managers = useMemo(
    () =>
      users.filter(
        (usersList: UserWithEventAndCompetitions) =>
          usersList.role === 'manager',
      ),
    [users],
  )

  const judgesAndTabulators = useMemo(
    () =>
      users.filter(
        (usersList: UserWithEventAndCompetitions) =>
          usersList.role === 'judge' || usersList.role === 'tabulator',
      ),
    [users],
  )

  return user?.role === 'manager' ? (
    <JudgesTabulatorsList
      onSearchChangeHandler={onSearchChangeHandler}
      onClearHandler={onClearHandler}
      judgesAndTabulators={judgesAndTabulators}
      filter={filter}
    />
  ) : (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList: 'gap-6 relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full',
          tab: 'max-w-fit px-0 h-12',
          // tabContent: 'group-data-[selected=true]:text-primary',
        }}
        color="secondary"
        variant="underlined"
        selectedKey={tab}
        onSelectionChange={(key) => onTabChangeHandler(key as userTabOptions)}
      >
        <Tab
          key="judges"
          title={
            <div className="flex items-center space-x-2">
              <CalculatorIcon />
              <span>Judges and Tabulators</span>
            </div>
          }
        >
          Judges and Tabulators List
        </Tab>

        {user?.role === 'admin' && (
          <Tab
            key="managers"
            title={
              <div className="flex items-center space-x-2">
                <ClipboardListIcon />
                <span>Event Managers</span>
              </div>
            }
          >
            <EventMangersList
              onSearchChangeHandler={onSearchChangeHandler}
              onClearHandler={onClearHandler}
              managers={managers}
              filter={filter}
            />
          </Tab>
        )}
      </Tabs>
    </div>
  )
}
