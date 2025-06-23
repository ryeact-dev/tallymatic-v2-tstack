import { Button, DatePicker, Form, Input } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { parseDate } from '@internationalized/date'
import { Controller, useForm } from 'react-hook-form'
import type { Event } from '~/generated/prisma/client'
import type { SubmitHandler } from 'react-hook-form'
import type { EventFormValues } from '~/zod/form.schema'
import { eventSchema } from '~/zod/form.schema'
import {
  useCreateEventMutation,
  useUpdateEventMutation,
} from '~/hooks/event.hook'
import SheetFooterButtons from '~/components/SheetFooterButtons'

interface EventSheetProps {
  onClose: () => void
  eventInfo: Event | null
}

const DEFAULT_VALUES: EventFormValues = {
  name: '',
  eventDate: new Date(),
  isActive: true,
}

export default function AddEventSheetBody({
  onClose,
  eventInfo,
}: EventSheetProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: eventInfo ? eventInfo : DEFAULT_VALUES,
  })

  const onResetForm = () => {
    reset(DEFAULT_VALUES)
  }

  const { mutate: createEventMutate, isPending: isCreatingEvent } =
    useCreateEventMutation(onResetForm, onClose)

  const { mutate: updateEventMutate, isPending: isUpdatingEvent } =
    useUpdateEventMutation(onResetForm, onClose)

  const onSubmit: SubmitHandler<EventFormValues> = (data) => {
    if (eventInfo?.id) {
      updateEventMutate({
        id: eventInfo.id,
        eventDate: new Date(eventInfo.eventDate),
        isActive: data.isActive,
        name: data.name,
      })
    } else {
      createEventMutate(data)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => {
          return (
            <Input
              {...field}
              label="Name"
              labelPlacement="outside"
              placeholder="Enter event name"
              isInvalid={!!errors.name}
              // errorMessage={errors.number?.message}
              classNames={{
                input: 'pl-1',
              }}
            />
          )
        }}
      />

      <Controller
        name="eventDate"
        control={control}
        render={({ field }) => {
          return (
            <DatePicker
              onChange={(date) => {
                field.onChange(date)
              }}
              value={parseDate(
                new Date(field.value).toISOString().split('T')[0],
              )}
              isInvalid={!!errors.eventDate}
              errorMessage="Please enter a valid date."
              label="Event Date"
              labelPlacement="outside"
            />
          )
        }}
      />

      <SheetFooterButtons
        data={eventInfo}
        onClose={onClose}
        isLoading={isCreatingEvent || isUpdatingEvent}
      />
    </Form>
  )
}
