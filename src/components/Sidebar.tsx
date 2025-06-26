import SidebarLinks from './sidebar/sidebar-links/SidebarLinks'
import SidebarAvatar from './sidebar/sidebar-avatar/SidebarAvatar'
import type { CompetitionLink, CurrentUser } from '~/utils/types'
import { cn } from '~/utils/cn'

interface SidebarProps {
  children: React.ReactNode
  className?: string
  isCollapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

function SidebarWrapper({
  children,
  className,
  isCollapsed = false,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'h-screen bg-background transition-all duration-300',
        isCollapsed ? 'w-0' : 'w-64',
        className,
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </aside>
  )
}

export default function Sidebar({
  user,
  isCollapsed,
  setIsCollapsed,
  competitionLinks,
}: {
  user: CurrentUser
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  competitionLinks: Array<CompetitionLink> | []
}) {
  return (
    <SidebarWrapper isCollapsed={isCollapsed} onCollapse={setIsCollapsed}>
      <div className="p-4">Logo</div>
      <div className="px-4 flex flex-col gap-4 items-start justify-between h-[95%]">
        <SidebarLinks user={user} competitionLinks={competitionLinks} />
        <SidebarAvatar user={user} />
      </div>
    </SidebarWrapper>
  )
}
