import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import type { UserCompetition } from '~/utils/types'
import type { UseFormSetValue } from 'react-hook-form'
import type { UserFormValues } from '~/zod/form.schema'
import { competitionQueries } from '~/hooks/competition.hook'

export default function SelectCompetitions({
  competitionIds,
  eventId,
  setValue,
}: {
  competitionIds: Array<string>
  eventId: string
  setValue: UseFormSetValue<UserFormValues>
}) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(competitionIds))

  const { data: competitions, isFetching: isFetchingCompetitions } = useQuery(
    competitionQueries.list({
      page: 1,
      limit: 20,
      filter: '',
      eventId,
    }),
  )

  const listOfCompetitions = useMemo<
    Array<{ key: string; label: string }>
  >(() => {
    return (
      competitions?.map((competition: UserCompetition) => ({
        key: competition.id,
        label: competition.name,
      })) || []
    )
  }, [competitions])

  // Add a function to get labels from selected keys
  const getSelectedLabels = () => {
    return Array.from(selectedKeys)
      .map(
        (key) =>
          listOfCompetitions.find((item) => item.key === key)?.label || '',
      )
      .filter((label) => label)
  }

  useEffect(() => {
    const filterCompetitionIds = Array.from(selectedKeys).map(
      (key) => listOfCompetitions.find((item) => item.key === key)?.key || '',
    )
    setValue('competitionIds', filterCompetitionIds)
  }, [selectedKeys, listOfCompetitions])

  return (
    <div className="space-y-3 mt-2">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <Button className="" variant="bordered" color="secondary">
            Select Competition/s
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          // disallowEmptySelection
          aria-label="Multiple selection example"
          closeOnSelect={false}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          variant="flat"
          onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
          color="secondary"
        >
          {listOfCompetitions.map((competition) => (
            <DropdownItem key={competition.key}>
              {competition.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {/* Update to display selected labels */}
      <div>
        <p className="text-sm mb-1">Competitions:</p>
        <div className="flex flex-wrap items-center gap-2">
          {getSelectedLabels().length > 0 ? (
            getSelectedLabels().map((label) => (
              <Chip key={label} color="secondary">
                • {label}
              </Chip>
            ))
          ) : (
            <Chip color="danger">Please select at least one competition</Chip>
          )}
        </div>
      </div>
    </div>
  )
}
