import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context }) => {
    const { user } = context

    if (!user) {
      throw redirect({ to: '/login', replace: true })
    }

    return { user }
  },
  loader: ({ context }) => {
    const { user, competitionLinks } = context

    const activeCompetition = competitionLinks.find(
      (competitionLink) => competitionLink.isActive,
    )

    if (user.role === 'judge') {
      if (!activeCompetition?.id)
        throw redirect({ to: '/waiting-page', replace: true })

      throw redirect({
        to: '/competitions',
        search: { filter: activeCompetition.id },
        replace: true,
      })
    }

    return { activeCompetition, user, competitionLinks }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
