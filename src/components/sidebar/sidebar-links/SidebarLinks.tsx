import { Link } from '@tanstack/react-router'
import {
  CalendarCogIcon,
  CircleChevronRightIcon,
  ClapperboardIcon,
  HomeIcon,
  UserIcon,
  Users2Icon,
} from 'lucide-react'
import type { CurrentUser, UserCompetition } from '~/utils/types'

const ACTIVE_LINK_CLASS = 'text-red-700 font-medium'

export default function SidebarLinks({
  user,
  competitionLinks,
}: {
  user: CurrentUser
  competitionLinks: Array<UserCompetition>
}) {
  return (
    <div className="flex flex-col gap-4 ">
      {/* Active Competitions */}
      <Link
        to="/"
        // search={{ filter: '', page: 1, sort: 'a-z', limit: 10 }}
        className={`flex items-center gap-2 p-2 text-md rounded-lg hover:bg-default-100`}
        activeProps={{ className: ACTIVE_LINK_CLASS }}
      >
        <HomeIcon size={18} />
        <span>Home Page</span>
      </Link>
      {/* Admin user cannot see competitions  */}
      {/* TODO: Need to fix this to view few compeitions rather than all */}
      {user.role !== 'admin' && (
        <div className=" space-y-2">
          <h2 className="text-sm font-medium">Competitions</h2>
          {competitionLinks.map((competitionLink) => (
            <Link
              key={competitionLink.id}
              to="/competitions"
              search={{ filter: competitionLink.id as string }}
              className={`flex items-center gap-2 p-2 text-md rounded-lg hover:bg-default-100`}
              activeProps={{ className: ACTIVE_LINK_CLASS }}
            >
              <CircleChevronRightIcon size={18} />
              <span>{competitionLink.name}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Rsults */}
      <div className=" space-y-2">
        <h2 className="text-sm font-medium">Results</h2>
        <Link
          to="/settings/candidates"
          search={{ filter: '', page: 1, sort: 'a-z', limit: 10 }}
          className={`flex items-center gap-2 p-2 text-md rounded-lg hover:bg-default-100`}
          activeProps={{ className: ACTIVE_LINK_CLASS }}
        >
          <Users2Icon size={18} />
          <span>Candidates</span>
        </Link>
      </div>

      {/* Settings */}
      <div className=" space-y-2">
        <h2 className="text-sm font-medium">Settings</h2>
        <Link
          to="/settings/candidates"
          search={{ filter: '', page: 1, sort: 'a-z', limit: 10 }}
          className={`flex items-center gap-2 p-2 text-md rounded-lg hover:bg-default-100`}
          activeProps={{ className: ACTIVE_LINK_CLASS }}
        >
          <Users2Icon size={18} />
          <span>Candidates</span>
        </Link>

        <Link
          to="/settings/competitions"
          search={{ filter: '', page: 1, sort: 'a-z', limit: 10 }}
          className={`flex items-center gap-2 p-2 text-md rounded-lg hover:bg-default-100`}
          activeProps={{ className: ACTIVE_LINK_CLASS }}
        >
          <ClapperboardIcon size={18} />
          <span>Competitions</span>
        </Link>

        {user.role === 'admin' && (
          <Link
            to="/settings/events"
            search={{ filter: '', page: 1, sort: 'a-z', limit: 10 }}
            className={`flex items-center gap-2 p-2 text-md rounded-lg hover:bg-default-100`}
            activeProps={{ className: ACTIVE_LINK_CLASS }}
          >
            <CalendarCogIcon size={18} />
            <span>Events</span>
          </Link>
        )}

        <Link
          to="/settings/users"
          search={{
            filter: '',
            tab: 'judges',
            page: 1,
            sort: 'a-z',
            limit: 10,
          }}
          className={`flex items-center gap-2 p-2 text-md rounded-lg hover:bg-default-100`}
          activeProps={{ className: ACTIVE_LINK_CLASS }}
        >
          <UserIcon size={18} />
          <span>Users</span>
        </Link>
      </div>
    </div>
  )
}
