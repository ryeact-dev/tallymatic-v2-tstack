import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Form, Input, Select, SelectItem } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import SelectCompetitions from './SelectCompetitions'
import type { SubmitHandler } from 'react-hook-form'
import type { UserWithEventAndCompetitions } from '~/utils/types'
import type { UserFormValues } from '~/zod/form.schema'
import { userSchema } from '~/zod/form.schema'
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '~/hooks/user.hooks'
import { randomPasswordGenerator } from '~/helpers/random-password-generator'
import SheetFooterButtons from '~/components/SheetFooterButtons'

export const userRoles = [
  {
    key: 'judge',
    label: 'Judge',
  },
  {
    key: 'tabulator',
    label: 'Tabulator',
  },
]

interface UserFormProps {
  onClose: () => void
  userInfo: UserWithEventAndCompetitions | null
}

const DEFAULT_VALUES: UserFormValues = {
  username: '',
  fullName: '',
  email: 'test@test.com',
  role: 'judge',
  isActive: true,
  photo: '',
  judgeNumber: 0,
  event: { id: '', name: '' },
}

const routeApi = getRouteApi('/settings/users')

export default function AddJudgesTabulatorsSheetBody({
  onClose,
  userInfo,
}: UserFormProps) {
  const { user } = routeApi.useRouteContext()
  const [userPassword, setUserPassword] = useState(randomPasswordGenerator())

  // const [competitionIds, setCompetitionIds] = useState<string[]>(
  //   userInfo?.competitionIds || []
  // );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: userInfo
      ? {
          ...userInfo,
          event: userInfo.event,
          competitionIds: userInfo.competitions?.map(
            (competition) => competition.id,
          ),
        }
      : {
          ...DEFAULT_VALUES,
          event: user?.event
            ? {
                id: user.event.id,
                name: user.event.name,
              }
            : DEFAULT_VALUES.event,
        },
  })

  const onResetForm = () => {
    reset(DEFAULT_VALUES)
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

    console.log(newUserData)

    if (userInfo) {
      updateUserMutate(newUserData)
    } else {
      createUserMutate(newUserData)
    }
  }

  // console.log(getValues());
  // console.log(errors);
  // console.log(watch('competitionIds'));

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
                input: 'pl-1 lowercase placeholder:normal-case',
              }}
            />
          )
        }}
      />

      {/* <Controller
        name='email'
        control={control}
        render={({ field }) => {
          return (
            <Input
              {...field}
              label='Email'
              labelPlacement='outside'
              placeholder='Enter user email'
              isInvalid={!!errors.email}
              // errorMessage={errors.number?.message}
              classNames={{
                input: 'pl-1',
              }}
            />
          );
        }}
      /> */}

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

      <div className="flex gap-4 items-center w-full">
        <Controller
          name="role"
          control={control}
          render={({ field }) => {
            return (
              <Select
                {...field}
                // className='max-w-xs'
                label="Role"
                placeholder="Select user role"
                labelPlacement="outside"
                defaultSelectedKeys={[
                  userInfo ? userInfo.role : userRoles[0].key,
                ]}
              >
                {userRoles.map((role) => (
                  <SelectItem key={role.key}>{role.label}</SelectItem>
                ))}
              </Select>
            )
          }}
        />

        <Controller
          name="judgeNumber"
          control={control}
          render={({ field }) => {
            return (
              <Input
                {...field}
                value={String(field.value)}
                onChange={(e) => field.onChange(Number(e.target.value))}
                label="Judge Number"
                labelPlacement="outside"
                isInvalid={!!errors.judgeNumber}
                isDisabled={watch('role') === 'tabulator'}
                // errorMessage={errors.number?.message}
                classNames={{
                  input: 'pl-1',
                }}
              />
            )
          }}
        />
      </div>

      <div>
        <SelectCompetitions
          setValue={setValue}
          competitionIds={watch('competitionIds') || []}
          eventId={user?.event?.id || ''}
        />
      </div>

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

      <SheetFooterButtons
        data={userInfo}
        onClose={onClose}
        isLoading={isCreatingUser || isUpdatingUser}
      />
    </Form>
  )
}
