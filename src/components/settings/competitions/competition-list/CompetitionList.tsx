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

import { EllipsisVerticalIcon, PlusIcon, SearchIcon } from 'lucide-react'

import type {
  UserCompetition,
  UserWithEventAndCompetitions,
} from '~/utils/types'

import type { ChipProps, Selection, SortDescriptor } from '@heroui/react'

import { openModal, openSheet } from '~/store'
import { useToggleUserMutation } from '~/hooks/user.hooks'
import { useToggleCompetitionMutation } from '~/hooks/competition.hook'

export const columns = [
  { name: 'NO.', uid: 'number', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'CRITERA', uid: 'criteria', sortable: false },
  { name: 'MULTIPIER', uid: 'multiplier', sortable: false },
  { name: 'TYPE', uid: 'isFinalist', sortable: false },
  { name: 'STATUS', uid: 'isActive', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
]

const statusColorMap: Record<string, ChipProps['color']> = {
  true: 'success',
  false: 'danger',
}

export default function CompetitionList({
  competitions = [],
  onSearchChangeHandler,
  onClearHandler,
  filter,
}: {
  competitions: Array<UserCompetition>
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
    let filteredCompetitions = [...competitions]

    if (hasSearchFilter) {
      filteredCompetitions = filteredCompetitions.filter((competition) =>
        competition.name.toLowerCase().includes(filter.toLowerCase()),
      )
    }

    return filteredCompetitions
  }, [competitions, filter])

  const rowsPerPage = 20
  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...items].sort((a: UserCompetition, b: UserCompetition) => {
      const first = a[sortDescriptor.column as keyof UserCompetition] as number
      const second = b[sortDescriptor.column as keyof UserCompetition] as number
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const onEditCompetitionHandler = (competition: UserCompetition) => {
    openSheet({
      title: `Update ${competition.name}'s details`,
      data: {
        type: 'competition',
        data: competition,
      },
      isSheetOpen: true,
      size: 'md',
    })
  }

  const onAddCompetitionHandler = () => {
    openSheet({
      title: 'Competition Details',
      data: {
        type: 'competition',
        data: null,
      },
      isSheetOpen: true,
      size: 'md',
    })
  }

  const onDeleteCompetitionHandler = (competition: UserCompetition) => {
    openModal({
      data: {
        type: 'delete-competition',
        data: { id: competition.id, name: competition.name },
      },
      isModalOpen: true,
      size: 'md',
    })
  }

  const { mutate: toggleCompetitionMutate, isPending: isTogglingCompetition } =
    useToggleCompetitionMutation()

  const onToggleUserHandler = (competition: UserCompetition) => {
    if (!competition.id) return null

    toggleCompetitionMutate({
      id: competition.id,
      isActive: competition.isActive ? false : true,
    })
  }

  const renderCell = useCallback(
    (competition: UserCompetition, columnKey: React.Key) => {
      const cellValue = competition[columnKey as keyof UserCompetition]

      switch (columnKey) {
        case 'number':
          return <div className="flex flex-col">{competition.number}</div>
        case 'name':
          return <div className="flex flex-col">{competition.name}</div>
        case 'criteria':
          return (
            <div className="flex flex-col max-w-60">
              {competition.criteria.map((criteria, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 justify-between"
                >
                  <p>{criteria.criteriaTitle}</p>
                  <p>{criteria.percent}%</p>
                </div>
              ))}
            </div>
          )
        case 'multiplier':
          return (
            <div className="flex flex-col">{`${competition.multiplier}%`}</div>
          )
        case 'isFinalist':
          return (
            <div className="flex flex-col">
              <p>{competition.isFinalist ? 'Major' : 'Minor'}</p>
              <p className="text-xs">
                {competition.finalists > 0
                  ? `${competition.finalists} finalists`
                  : 'No finalists'}
              </p>
            </div>
          )

        case 'isActive':
          return (
            <Button
              className="capitalize rounded-full"
              color={statusColorMap[String(competition.isActive)]}
              size="sm"
              variant="flat"
              onPress={() => onToggleUserHandler(competition)}
              isLoading={isTogglingCompetition}
              isDisabled={isTogglingCompetition}
            >
              {competition.isActive ? 'Active' : 'Inactive'}
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
                    onClick={() => onEditCompetitionHandler(competition)}
                  >
                    Edit
                  </DropdownItem>

                  <DropdownItem
                    className="text-danger hover:text-white"
                    color="danger"
                    key="delete"
                    onClick={() => onDeleteCompetitionHandler(competition)}
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
              onPress={onAddCompetitionHandler}
            >
              Add New
            </Button>
          </div>
        </div>
      </div>
    )
  }, [filter, onSearchChangeHandler, competitions.length, hasSearchFilter])

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

  // TODO: IF USER IS ADMIN, SHOW THE EVENT FILTER FOR EVENT COMPETITIONS
  // TODO: IF USER IS ADMIN, SHOW ALL COMPETITIONS FOR DIFFERENT EVENTS AND IF USER IS MANAGER SHOW ONLY THEIR COMPETITIONS

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
