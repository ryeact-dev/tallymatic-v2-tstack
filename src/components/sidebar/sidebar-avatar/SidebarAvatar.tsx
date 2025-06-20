import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from '@heroui/react'
import { LogOutIcon } from 'lucide-react'
import type { CurrentUser } from '~/utils/types'
import { useLogoutUserMutation } from '~/hooks/auth.hook'

export default function SibarAvatar({ user }: { user: CurrentUser }) {
  const { mutate: logoutUserMutate } = useLogoutUserMutation()

  const handleLogout = () => {
    logoutUserMutate(null)
  }

  return (
    <Dropdown
      showArrow
      classNames={{
        base: 'before:bg-default-200', // change arrow background
        content: 'p-0 border-small border-divider bg-background',
      }}
      radius="sm"
    >
      <DropdownTrigger>
        <User
          as="button"
          //   avatarProps={{
          //     src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
          //   }}
          className="transition-transform"
          description={<p className="capitalize">{user.role}</p>}
          name={<p>{user.fullName}</p>}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Custom item styles"
        className="p-3"
        disabledKeys={['profile']}
        itemClasses={{
          base: [
            'rounded-md',
            'text-default-500',
            'transition-opacity',
            'data-[hover=true]:text-foreground',
            'data-[hover=true]:bg-default-100',
            'dark:data-[hover=true]:bg-default-50',
            'data-[selectable=true]:focus:bg-default-50',
            'data-[pressed=true]:opacity-70',
            'data-[focus-visible=true]:ring-default-500',
          ],
        }}
      >
        <DropdownSection showDivider aria-label="Profile & Actions">
          <DropdownItem
            key="profile"
            isReadOnly
            className="h-14 gap-2 opacity-100"
          >
            <User
              avatarProps={{
                size: 'sm',
                // src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
              }}
              className="transition-transform"
              description={<p className="capitalize">{user.role}</p>}
              name={<p>{user.fullName}</p>}
            />
            <p>{user.event?.name}</p>
          </DropdownItem>
        </DropdownSection>

        {/* <DropdownSection showDivider aria-label='Preferences'>
          <DropdownItem key='quick_search' shortcut='⌘K'>
            Quick search
          </DropdownItem>
          <DropdownItem
            key='theme'
            isReadOnly
            className='cursor-default'
            endContent={
              <select
                className='z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500'
                id='theme'
                name='theme'
              >
                <option>System</option>
                <option>Dark</option>
                <option>Light</option>
              </select>
            }
          >
            Theme
          </DropdownItem>
        </DropdownSection> */}

        <DropdownSection aria-label="Help & Feedback">
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem
            key="logout"
            onPress={handleLogout}
            startContent={<LogOutIcon size={16} />}
          >
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
