import { createFileRoute, useNavigate } from '@tanstack/react-router'
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

import { useSuspenseQuery } from '@tanstack/react-query'
import {
  CalendarIcon,
  EllipsisVerticalIcon,
  SearchIcon,
  SquareAsteriskIcon,
  SquarePenIcon,
  TrashIcon,
} from 'lucide-react'
import type { ChipProps, Selection, SortDescriptor } from '@heroui/react'
import type { CandidateNoCreatedAt } from '~/utils/types'
import type { Candidate } from '~/generated/prisma/client'
import ToastNotification from '~/components/toast-notification/ToastNotification'
import { openModal, openSheet } from '~/store'
import { searchSchema } from '~/zod/search.schema'
import { debounce } from '~/utils/debounce'
import { candidateQueries } from '~/hooks/candidate.hook'

export const columns = [
  { name: 'NO.', uid: 'number', sortable: true },
  { name: 'CANDIDATE', uid: 'name', sortable: true },
  // { name: 'INFO', uid: 'course' },
  { name: 'ACTIONS', uid: 'actions' },
]

const statusColorMap: Record<string, ChipProps['color']> = {
  true: 'success',
  false: 'danger',
}

export const Route = createFileRoute('/settings/candidates')({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { page, filter } }) => ({ page, filter }),
  loader: async ({ context, deps: { filter, page } }) => {
    await context.queryClient.ensureQueryData(
      candidateQueries.list({
        page,
        limit: 20,
        filter,
        eventId: context.user?.event?.id || '',
      }),
    )
  },
  head: () => ({
    meta: [{ title: 'Tallymatic | Settings - Events' }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { user } = Route.useRouteContext()
  const { filter, page, sort } = Route.useSearch()

  const { data: candidates = [] } = useSuspenseQuery(
    candidateQueries.list({
      page,
      limit: 20,
      filter: '',
      eventId: user?.event?.id || '',
    }),
  )

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  })

  const onPageChangeHandler = (pageValue: number) => {
    navigate({ to: '.', search: { page: pageValue, filter, sort } })
  }

  const hasSearchFilter = Boolean(filter)

  const filteredItems = useMemo(() => {
    let filteredUsers = [...(candidates || [])]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.fullName.toLowerCase().includes(filter.toLowerCase()),
      )
    }

    return filteredUsers
  }, [candidates, filter])

  const rowsPerPage = 20
  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Candidate, b: Candidate) => {
      const first = a[sortDescriptor.column as keyof Candidate]
      const second = b[sortDescriptor.column as keyof Candidate]

      let cmp = 0
      if (typeof first === 'number' && typeof second === 'number') {
        cmp = first - second
      } else if (typeof first === 'string' && typeof second === 'string') {
        cmp = first.localeCompare(second)
      } else if (first instanceof Date && second instanceof Date) {
        cmp = first.getTime() - second.getTime()
      } else {
        cmp = String(first).localeCompare(String(second))
      }

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const onEditCandidateHandler = useCallback(
    (candidate: CandidateNoCreatedAt) => {
      openSheet({
        data: {
          type: 'candidate',
          data: candidate,
        },
        isSheetOpen: true,
        size: 'sm',
      })
    },
    [],
  )

  const onAddCandidateHandler = useCallback(() => {
    openSheet({
      title: 'Candidate Details',
      data: {
        type: 'candidate',
        data: null,
      },
      isSheetOpen: true,
      size: 'sm',
    })
  }, [])

  const onDeleteCandidateHandler = (candidate: CandidateNoCreatedAt) => {
    openModal({
      data: {
        type: 'delete-candidate',
        data: { id: candidate.id, name: candidate.fullName },
      },
      isModalOpen: true,
      size: 'md',
    })
  }

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        navigate({ to: '.', search: { page: 1, filter: value, sort } })
      }, 300),
    [navigate, sort],
  )

  // Use it in your search handler
  const onSearchChange = useCallback(
    (value?: string) => {
      if (value) {
        debouncedSearch(value)
      } else {
        navigate({ to: '.', search: { page, filter: '', sort } })
      }
    },
    [debouncedSearch, page, sort],
  )

  const onClear = useCallback(() => {
    navigate({ to: '.', search: { page: 1, filter: '', sort } })
  }, [])

  const renderCell = useCallback(
    (candidate: CandidateNoCreatedAt, columnKey: React.Key) => {
      const cellValue = candidate[columnKey as keyof CandidateNoCreatedAt]

      switch (columnKey) {
        case 'number':
          return <div className="flex flex-col">{candidate.number}</div>
        case 'name':
          return (
            <User
              avatarProps={{ radius: 'full', src: candidate.photo }}
              description={candidate.course}
              name={candidate.fullName}
            />
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
                    onClick={() => onEditCandidateHandler(candidate)}
                    startContent={<SquarePenIcon className="h-4 w-4" />}
                  >
                    Edit
                  </DropdownItem>

                  <DropdownItem
                    className="text-danger hover:text-white"
                    color="danger"
                    key="delete"
                    onClick={() => onDeleteCandidateHandler(candidate)}
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
            typeof cellValue === 'boolean'
          ) {
            return String(cellValue)
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
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />

          <Button
            color="primary"
            endContent={<CalendarIcon size={18} className="-mt-0.5" />}
            onPress={onAddCandidateHandler}
          >
            Add Event
          </Button>
        </div>
      </div>
    )
  }, [filter, onSearchChange, candidates?.length, hasSearchFilter])

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
          onChange={onPageChangeHandler}
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
