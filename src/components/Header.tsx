import { useLocation, useNavigate } from '@tanstack/react-router'
import { Button } from '@heroui/react'
import { useEffect } from 'react'
import { PanelLeftIcon } from 'lucide-react'
import type { CurrentUser } from '~/utils/types'
import { useLogoutUserMutation } from '~/hooks/auth.hook'

export default function Header({
  user,
  setIsCollapsed,
  isCollapsed,
}: {
  user: CurrentUser | null
  setIsCollapsed: (isCollapsed: boolean) => void
  isCollapsed: boolean
}) {
  const navigate = useNavigate()
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  const { mutate: logoutUserMutate } = useLogoutUserMutation()

  useEffect(() => {
    if (!user) {
      navigate({ to: '/login', replace: true })
      return
    }

    if (pathname.toString().includes('login')) {
      navigate({ to: '/', replace: true })
      return
    }
  }, [user])

  const onLogout = () => {
    logoutUserMutate(null)
  }

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
