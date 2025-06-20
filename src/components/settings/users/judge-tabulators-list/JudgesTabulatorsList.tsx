import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from '@heroui/react'

import {
  EllipsisVerticalIcon,
  PlusIcon,
  SearchIcon,
  SquareAsteriskIcon,
  SquarePenIcon,
  TrashIcon,
} from 'lucide-react'

import type { UserWithEventAndCompetitions } from '~/utils/types'
import type { ChipProps, Selection, SortDescriptor } from '@heroui/react'
import { openModal, openSheet } from '~/store'
import { useToggleUserMutation } from '~/hooks/user.hooks'

export const columns = [
  { name: 'USERNAME', uid: 'username', sortable: true },
  { name: 'NAME', uid: 'fullName', sortable: true },
  { name: 'COMPETITIONS', uid: 'competitions', sortable: false },
  { name: 'STATUS', uid: 'isActive', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
]

const statusColorMap: Record<string, ChipProps['color']> = {
  true: 'success',
  false: 'danger',
}

export default function JudgesAndTabulatorsList({
  judgesAndTabulators = [],
  onSearchChangeHandler,
  onClearHandler,
  filter,
}: {
  judgesAndTabulators: Array<UserWithEventAndCompetitions>
  onClearHandler: () => void
  onSearchChangeHandler: (value: string) => void
  filter: string
}) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'username',
    direction: 'ascending',
  })

  const [page, setPage] = useState(1)

  const hasSearchFilter = Boolean(filter)

  const filteredItems = useMemo(() => {
    let filteredUsers = [...judgesAndTabulators]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.fullName.toLowerCase().includes(filter.toLowerCase()),
      )
    }

    return filteredUsers
  }, [judgesAndTabulators, filter])

  const rowsPerPage = 20
  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...items].sort(
      (a: UserWithEventAndCompetitions, b: UserWithEventAndCompetitions) => {
        const first = a[
          sortDescriptor.column as keyof UserWithEventAndCompetitions
        ] as number
        const second = b[
          sortDescriptor.column as keyof UserWithEventAndCompetitions
        ] as number
        const cmp = first < second ? -1 : first > second ? 1 : 0

        return sortDescriptor.direction === 'descending' ? -cmp : cmp
      },
    )
  }, [sortDescriptor, items])

  const onEditUserHandler = (user: UserWithEventAndCompetitions) => {
    openSheet({
      title: `Update ${user.fullName}'s details`,
      data: {
        type: 'user',
        data: user,
      },
      isSheetOpen: true,
      size: 'md',
    })
  }

  const onAddUserHandler = () => {
    openSheet({
      title: 'User Details',
      data: {
        type: 'user',
        data: null,
      },
      isSheetOpen: true,
      size: 'md',
    })
  }

  const onDeleteEventHandler = (user: UserWithEventAndCompetitions) => {
    openModal({
      data: {
        type: 'delete-user',
        data: { id: user.id, name: user.fullName, role: user.role },
      },
      isModalOpen: true,
      size: 'md',
    })
  }

  const onResetPasswordHandler = (user: UserWithEventAndCompetitions) => {
    openModal({
      data: {
        type: 'password-reset',
        data: {
          id: user.id,
          name: user.fullName,
          username: user.username,
          role: user.role,
        },
      },
      isModalOpen: true,
      size: 'md',
    })
  }

  const { mutate: toggleUserMutate, isPending: isTogglingUser } =
    useToggleUserMutation()

  const onToggleUserHandler = (user: UserWithEventAndCompetitions) => {
    toggleUserMutate({
      id: user.id,
      isActive: user.isActive ? false : true,
      role: user.role,
    })
  }

  const renderCell = useCallback(
    (user: UserWithEventAndCompetitions, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof UserWithEventAndCompetitions]

      switch (columnKey) {
        case 'username':
          return <div className="flex flex-col">{user.username}</div>
        case 'fullName':
          return (
            <User
              avatarProps={{ radius: 'lg', src: user.photo }}
              description={`Judge No: ${user.judgeNumber}`}
              name={user.fullName}
            />
          )
        case 'competitions':
          return (
            <div className="text-sm">
              {user.competitions
                ? user.competitions.length > 0
                  ? user.competitions.map((competition, index) => (
                      <p key={index}>{competition.name}</p>
                    ))
                  : 'No competitions'
                : 'No Competitions'}
            </div>
          )
        case 'isActive':
          return (
            <Button
              className="capitalize rounded-full"
              color={statusColorMap[String(user.isActive)]}
              size="sm"
              variant="flat"
              // onPress={() => onToggleUserHandler(user)}
              isLoading={isTogglingUser}
              isDisabled={isTogglingUser}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </Button>
          )
        case 'actions':
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <EllipsisVerticalIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu color="primary">
                  <DropdownItem
                    key="edit"
                    onClick={() => onEditUserHandler(user)}
                    startContent={<SquarePenIcon className="h-4 w-4" />}
                  >
                    Edit
                  </DropdownItem>

                  <DropdownItem
                    showDivider
                    key="reset-password"
                    onClick={() => onResetPasswordHandler(user)}
                    startContent={<SquareAsteriskIcon className="h-4 w-4" />}
                  >
                    Reset Password
                  </DropdownItem>

                  <DropdownItem
                    className="text-danger hover:text-white"
                    color="danger"
                    key="delete"
                    onClick={() => onDeleteEventHandler(user)}
                    startContent={<TrashIcon className="h-4 w-4" />}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )
        default:
          if (
            typeof cellValue === 'string' ||
            typeof cellValue === 'number' ||
            typeof cellValue === 'boolean' ||
            cellValue === undefined
          ) {
            return String(cellValue ?? '')
          }
          // For objects/arrays, show JSON or a placeholder
          return JSON.stringify(cellValue)
      }
    },
    [],
  )

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon size={16} className="text-default-800" />}
            value={filter}
            onClear={() => onClearHandler()}
            onValueChange={onSearchChangeHandler}
          />
          <div className="flex gap-3">
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onPress={onAddUserHandler}
            >
              Add New
            </Button>
          </div>
        </div>
      </div>
    )
  }, [
    filter,
    onSearchChangeHandler,
    judgesAndTabulators.length,
    hasSearchFilter,
  ])

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    )
  }, [selectedKeys, items.length, page, pages, hasSearchFilter])

  return (
    <>
      <Table
        isHeaderSticky
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-full',
        }}
        //   selectedKeys={selectedKeys}
        //   selectionMode='multiple'
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'end' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={'No users found'} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
