import { Button, Form, Input, Select, SelectItem } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import type { UserWithEventAndCompetitions } from '~/utils/types'
import type { UserFormValues } from '~/zod/form.schema'
import { randomPasswordGenerator } from '~/helpers/random-password-generator'
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '~/hooks/user.hooks'
import { userSchema } from '~/zod/form.schema'

interface UserFormProps {
  onClose: () => void
  userInfo: UserWithEventAndCompetitions | null
}

const DEFAULT_VALUES: UserFormValues = {
  username: '',
  fullName: '',
  email: '',
  role: 'manager',
  isActive: true,
  photo: '',
  judgeNumber: 0,
  event: { id: '', name: '' },
}

const routeApi = getRouteApi('/settings/users')

export default function AddEventManagerSheetBody({
  onClose,
  userInfo,
}: UserFormProps) {
  const [userPassword, setUserPassword] = useState(randomPasswordGenerator())

  const events =
    routeApi.useLoaderData()?.events.map((event) => {
      return {
        key: event.id,
        label: event.name,
      }
    }) || []

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: userInfo
      ? { ...userInfo, event: userInfo.event }
      : DEFAULT_VALUES,
  })

  const onResetForm = () => {
    reset(DEFAULT_VALUES)
    setUserPassword(randomPasswordGenerator())
  }

  // Add this useEffect to handle eventInfo changes
  // useEffect(() => {
  //   if (userInfo) {
  //     reset({ ...userInfo, event: userInfo.event });
  //   } else {
  //     onResetForm();
  //   }
  // }, [userInfo]);

  const { mutate: createUserMutate, isPending: isCreatingUser } =
    useCreateUserMutation(onResetForm, onClose)

  const { mutate: updateUserMutate, isPending: isUpdatingUser } =
    useUpdateUserMutation(onResetForm, onClose)

  const onSubmit: SubmitHandler<UserFormValues> = (data) => {
    const newUserData = {
      ...data,
      password: userInfo ? userInfo.password : userPassword,
      id: userInfo?.id || '',
    }

    if (userInfo) {
      updateUserMutate(newUserData)
    } else {
      createUserMutate(newUserData)
    }
  }

  const onSelectChangeHandler = (key: string | undefined) => {
    if (!key) return

    const selectedEvent = events.find((event) => event.key === key) || {
      key: '',
      label: '',
    }

    clearErrors('event')

    setValue('event', {
      id: selectedEvent.key,
      name: selectedEvent.label,
    })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Controller
        name="username"
        control={control}
        render={({ field }) => {
          return (
            <Input
              {...field}
              label="Username"
              labelPlacement="outside"
              placeholder="Enter username"
              isInvalid={!!errors.username}
              // errorMessage={errors.number?.message}
              classNames={{
                input: 'pl-1 lowercase',
              }}
            />
          )
        }}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => {
          return (
            <Input
              {...field}
              label="Email"
              labelPlacement="outside"
              placeholder="Enter user email"
              isInvalid={!!errors.email}
              // errorMessage={errors.number?.message}
              classNames={{
                input: 'pl-1',
              }}
            />
          )
        }}
      />

      <Controller
        name="fullName"
        control={control}
        render={({ field }) => {
          return (
            <Input
              {...field}
              label="Full Name"
              labelPlacement="outside"
              placeholder="Enter full name"
              isInvalid={!!errors.fullName}
              // errorMessage={errors.number?.message}
              classNames={{
                input: 'pl-1',
              }}
            />
          )
        }}
      />

      <Select
        // value={watch('event') ? watch('event').id : ''}
        selectedKeys={[watch('event').id]}
        onSelectionChange={(key) => {
          onSelectChangeHandler(key.currentKey)
        }}
        // className='max-w-xs'
        label="Event"
        placeholder="Select event"
        labelPlacement="outside"
        isInvalid={!!errors.event}
        items={events}
      >
        {(event) => <SelectItem>{event.label}</SelectItem>}
      </Select>

      {!userInfo && (
        <div className="border rounded-xl w-full p-2">
          <p className="text-sm text-gray-600">
            default password:{' '}
            <span className="font-bold text-base text-primary">
              {userPassword}
            </span>
          </p>
        </div>
      )}

      <div className="flex justify-end gap-4 w-full mt-8">
        <Button
          color="danger"
          type="button"
          variant="light"
          onPress={onClose}
          disabled={isCreatingUser || isUpdatingUser}
        >
          Close
        </Button>
        <Button
          disabled={isCreatingUser || isUpdatingUser}
          isLoading={isCreatingUser || isUpdatingUser}
          color="primary"
          type="submit"
          className="w-40"
        >
          {userInfo?.id ? 'Update' : 'Submit'}
        </Button>
      </div>
    </Form>
  )
}
