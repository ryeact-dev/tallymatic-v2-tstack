import { Button, Card, Form, Input, Radio, RadioGroup } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'

import { Controller, useForm } from 'react-hook-form'
import Criteria from './Criteria'

import type { SubmitHandler } from 'react-hook-form'
import type { CompetitionFormValues } from '~/zod/form.schema'
import type { CriteriaItem, UserCompetition } from '~/utils/types'

import { competitionSchema } from '~/zod/form.schema'
import ToastNotification from '~/components/toast-notification/ToastNotification'
import {
  useCreateCompetitionMutation,
  useUpdateCompetitionMutation,
} from '~/hooks/competition.hook'
import SheetFooterButtons from '~/components/SheetFooterButtons'

interface CompetitionSheetProps {
  onClose: () => void
  compInfo: UserCompetition | null
}

const DEFAULT_VALUES: CompetitionFormValues = {
  number: 0,
  name: '',
  multiplier: 1,
  finalists: 0,
  isFinalist: false,
}

const routeApi = getRouteApi('/settings/competitions')

export default function AddCompetitionSheetBody({
  onClose,
  compInfo,
}: CompetitionSheetProps) {
  const { user } = routeApi.useRouteContext()

  const [criteria, setCriteria] = useState<Array<CriteriaItem>>(
    compInfo && compInfo.criteria.length > 0
      ? (compInfo.criteria as unknown as Array<CriteriaItem>)
      : [{ criteriaTitle: '', percent: 0 }],
  )

  // Initialize react-hook-form with zod resolver
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CompetitionFormValues>({
    resolver: zodResolver(competitionSchema),
    defaultValues: compInfo ? compInfo : DEFAULT_VALUES,
  })

  const handleRemoveCriteria = () => {
    if (criteria.length === 1) {
      setCriteria([{ criteriaTitle: '', percent: 0 }])
    } else {
      setCriteria((prevState) => prevState.slice(0, -1))
    }
  }

  const handleAddCriteria = () => {
    setCriteria((prevState) => [
      ...prevState,
      { criteriaTitle: '', percent: 0 },
    ])
  }

  const onResetForm = () => {
    reset()
    setCriteria([{ criteriaTitle: '', percent: 0 }])
  }

  const { mutate: createCompetitionMutate, isPending: isCreatingCompetition } =
    useCreateCompetitionMutation(onResetForm, onClose)

  const { mutate: updateCompetitionMutate, isPending: isUpdatingCompetition } =
    useUpdateCompetitionMutation(onResetForm, onClose)

  const onSubmit: SubmitHandler<CompetitionFormValues> = (data) => {
    if (!user?.event?.id) {
      return ToastNotification({
        title: 'Adding Competition',
        description: 'Please select an event',
        color: 'danger',
      })
    }

    const blankCriteria = criteria.some(
      (item) => !item.criteriaTitle.trim() || item.percent === 0,
    )

    if (blankCriteria) {
      return ToastNotification({
        title: 'Adding Competition',
        description: 'Criteria are required',
        color: 'danger',
      })
    }

    const totalPercentage = criteria.reduce(
      (total, item) => total + Number(item.percent),
      0,
    )

    if (totalPercentage !== 100) {
      return ToastNotification({
        title: 'Adding Competition',
        description: 'Criteria must have an exact total of 100%',
        color: 'danger',
      })
    }

    compInfo
      ? updateCompetitionMutate({
          ...data,
          criteria,
          isActive: compInfo.isActive,
          eventId: compInfo.eventId || '',
        })
      : createCompetitionMutate({
          ...data,
          criteria,
          isActive: false,
          eventId: user.event.id || '',
        })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Controller
        name="number"
        control={control}
        render={({ field }) => {
          const defaultValue =
            Number(field.value) > 0 ? String(field.value) : ''

          return (
            <Input
              {...field}
              value={defaultValue}
              label="Number"
              labelPlacement="outside"
              placeholder="Enter competition number"
              isInvalid={!!errors.number}
              // errorMessage={errors.number?.message}
              classNames={{
                input: 'pl-1',
              }}
            />
          )
        }}
      />

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Name"
            labelPlacement="outside"
            placeholder="Enter competition name"
            isInvalid={!!errors.name}
            // errorMessage={errors.name?.message}
            classNames={{
              input: 'pl-1',
            }}
          />
        )}
      />

      <div className="flex gap-4 w-full">
        <Controller
          name="multiplier"
          control={control}
          render={({ field }) => {
            return (
              <Input
                {...field}
                value={String(field.value)}
                label="Multiplier"
                labelPlacement="outside"
                placeholder="Enter competition multiplier"
                isInvalid={!!errors.multiplier}
                // errorMessage={errors.multiplier?.message}
                classNames={{
                  input: 'pl-1',
                }}
              />
            )
          }}
        />

        <Controller
          name="finalists"
          control={control}
          render={({ field }) => {
            const defaultValue =
              Number(field.value) > 0
                ? String(field.value)
                : !watch('isFinalist')
                  ? '0'
                  : ''

            return (
              <Input
                {...field}
                value={defaultValue}
                label="How many finalists?"
                labelPlacement="outside"
                placeholder="Enter finalists count"
                isInvalid={!!errors.finalists}
                // errorMessage={errors.finalists?.message}
                disabled={!watch('isFinalist')}
                classNames={{
                  input: `pl-1 ${!watch('isFinalist') ? 'cursor-not-allowed' : ''}`,
                }}
              />
            )
          }}
        />
      </div>

      <Controller
        name="isFinalist"
        control={control}
        render={({ field: { value, onChange } }) => (
          <RadioGroup
            value={String(value)}
            onValueChange={(val) => {
              const boolVal = val === 'true'
              onChange(boolVal)
            }}
            classNames={{
              base: 'w-full border p-3 rounded-xl',
              label: 'text-black -mb-1',
            }}
            label="Competition Type"
          >
            <div className="flex gap-4 items-center ">
              <Radio value="false">Minor</Radio>
              <Radio value="true">Major</Radio>
            </div>
          </RadioGroup>
        )}
      />

      <div className="!mt-3 !mb-1">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Criteria</h2>

          <div className="space-x-2">
            <Button
              color="danger"
              type="button"
              size="sm"
              className="text-base font-bold"
              isDisabled={!criteria[0].criteriaTitle}
              onPress={handleRemoveCriteria}
            >
              -
            </Button>
            <Button
              color="primary"
              type="button"
              size="sm"
              className="text-base font-bold"
              isDisabled={criteria.length > 7}
              onPress={handleAddCriteria}
            >
              +
            </Button>
          </div>
        </div>
        <Card className="shadow-none p-2 rounded-2xl border-dashed border-[1px] border-primary">
          {criteria.map((item, index) => (
            <Criteria
              key={index}
              index={index}
              setCriteria={setCriteria}
              criteria={item}
            />
          ))}
        </Card>
      </div>

      <SheetFooterButtons
        data={compInfo}
        onClose={onClose}
        isLoading={isCreatingCompetition || isUpdatingCompetition}
      />
    </Form>
  )
}
