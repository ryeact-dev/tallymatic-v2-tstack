import { useLocation, useNavigate } from '@tanstack/react-router'
import { Button } from '@heroui/react'
import { useEffect } from 'react'
import { PanelLeftIcon } from 'lucide-react'
import type { CompetitionLink, CurrentUser } from '~/utils/types'

export default function Header({
  user,
  setIsCollapsed,
  isCollapsed,
  competitionLinks,
}: {
  user: CurrentUser | null
  setIsCollapsed: (isCollapsed: boolean) => void
  isCollapsed: boolean
  competitionLinks: Array<CompetitionLink> | []
}) {
  const navigate = useNavigate()
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  const activeCompetitionId = competitionLinks.find(
    (competitionLink) => competitionLink.isActive,
  )?.id

  useEffect(() => {
    if (!user) {
      navigate({ to: '/login', replace: true })
      return
    }

    if (pathname.includes('login')) {
      if (user.role === 'judge') {
        navigate({
          to: '/competitions',
          search: { filter: activeCompetitionId || '' },
          replace: true,
        })
        return
      }

      navigate({ to: '/', replace: true })
      return
    }
  }, [user])

  return (
    <div className="flex gap-2 items-center my-2">
      {user && (
        <>
          <Button
            size="sm"
            isIconOnly
            variant="light"
            onPress={() => setIsCollapsed(!isCollapsed)}
          >
            <PanelLeftIcon />
          </Button>

          <p> {pathname}</p>
        </>
      )}
    </div>

    // <div className='p-2 flex gap-2 text-lg '>

    //   <Link
    //     to='/route-a'
    //     activeProps={{
    //       className: 'font-bold',
    //     }}
    //   >
    //     Pathless Layout
    //   </Link>{' '}
    //   <Link
    //     to='/deferred'
    //     activeProps={{
    //       className: 'font-bold',
    //     }}
    //   >
    //     Deferred
    //   </Link>{' '}
    //   <Link
    //     // @ts-expect-error
    //     to='/this-route-does-not-exist'
    //     activeProps={{
    //       className: 'font-bold',
    //     }}
    //   >
    //     This Route Does Not Exist
    //   </Link>
    // </div>
  )
}
