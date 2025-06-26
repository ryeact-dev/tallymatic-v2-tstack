import { HeroUIProvider, ToastProvider } from '@heroui/react'

import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, lazy, useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import Header from '../components/Header'
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import type { CompetitionLink, CurrentUser } from '~/utils/types/index.ts'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary.tsx'
import { NotFound } from '~/components/NotFound.tsx'
import { authQueries } from '~/hooks/auth.hook.ts'
import ConfimationModal from '~/components/ConfimationModal.tsx'
import SheetContainer from '~/components/SheetContainer.tsx'
import { seo } from '~/utils/seo'
import Sidebar from '~/components/Sidebar'
import { competitionQueries } from '~/hooks/competition.hook'

interface MyRouterContext {
  queryClient: QueryClient
  user: CurrentUser | null
  competitionLinks: Array<CompetitionLink> | []
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authQueries.user())

    return { user }
  },
  loader: async ({ context }) => {
    const { user } = context

    let competitionLinks: Array<CompetitionLink> = []

    if (user) {
      const competitions = await context.queryClient.ensureQueryData(
        competitionQueries.list({
          filter: '',
          page: 1,
          limit: 20,
          eventId: user.event?.id || '',
        }),
      )

      competitionLinks = competitions
        .map((competition) => ({
          id: competition.id || '',
          name: competition.name,
          number: competition.number,
          isActive: competition.isActive,
        }))
        .filter((competition) => competition.id)
    }

    return { user, competitionLinks }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title:
          'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { competitionLinks } = Route.useLoaderData()
  const { data: user } = useSuspenseQuery(authQueries.user())

  return (
    <RootDocument>
      <div className="flex h-screen">
        {user && (
          <Sidebar
            user={user}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            competitionLinks={competitionLinks}
          />
        )}
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-100/50 rounded-2xl">
          <main className="flex-1 p-4 -mt-4 overflow-auto">
            <Header
              user={user}
              setIsCollapsed={setIsCollapsed}
              isCollapsed={isCollapsed}
              competitionLinks={competitionLinks}
            />
            <Outlet />

            {/* Modal */}
            <ConfimationModal />

            {/* Sheet */}
            <SheetContainer />
          </main>
        </div>
      </div>
    </RootDocument>
  )
}

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/react-router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <HeroUIProvider>
          <ToastProvider />
          {children}
          <Scripts />
        </HeroUIProvider>
        <Suspense>
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </body>
    </html>
  )
}
