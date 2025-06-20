import { Button, Form, Input } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRouteApi } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
import type { CandidateNoCreatedAt } from '~/utils/types'
import type { SubmitHandler } from 'react-hook-form'
import type { CandidateFormValues } from '~/zod/form.schema'
import { candidateBaseSchema } from '~/zod/form.schema'
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '~/hooks/user.hooks'

interface CandidateFormProps {
  onClose: () => void
  candidateInfo: CandidateNoCreatedAt | null
}

const DEFAULT_VALUES: CandidateFormValues = {
  id: '',
  fullName: '',
  number: 0,
  course: '',
  photo: '',
  eventId: '',
}

const routeApi = getRouteApi('/settings/candidates')

export default function AddCandidateSheetBody({
  onClose,
  candidateInfo,
}: CandidateFormProps) {
  const { user } = routeApi.useRouteContext()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateBaseSchema),
    defaultValues: candidateInfo ? candidateInfo : DEFAULT_VALUES,
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

  const onSubmit: SubmitHandler<CandidateFormValues> = (data) => {
    const newUserData = {
      ...data,
      eventId: user?.event?.id || '',
      id: candidateInfo?.id || '',
    }

    // if (candidateInfo) {
    //   updateUserMutate(newUserData);
    // } else {
    //   createUserMutate(newUserData);
    // }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* TODO: IMAGE COMPONENT AND MODAL CROPPER COMPONENT */}
      {/* ---------------------------------- */}
      <Controller
        name="fullName"
        control={control}
        render={({ field }) => {
          return (
            <Input
              {...field}
              label="Candidate Name"
              labelPlacement="outside"
              placeholder="Enter name"
              isInvalid={!!errors.fullName}
              // errorMessage={errors.number?.message}
              classNames={{
                input: 'pl-1 lowercase',
              }}
            />
          )
        }}
      />

      <Controller
        name="course"
        control={control}
        render={({ field }) => {
          return (
            <Input
              {...field}
              label="Course"
              labelPlacement="outside"
              placeholder="Enter course"
              isInvalid={!!errors.course}
              // errorMessage={errors.number?.message}
              classNames={{
                input: 'pl-1',
              }}
            />
          )
        }}
      />

      <Controller
        name="number"
        control={control}
        render={({ field }) => {
          return (
            <Input
              {...field}
              type="number"
              value={String(field.value)}
              onChange={(e) => field.onChange(Number(e.target.value))}
              label="Candidate number"
              labelPlacement="outside"
              placeholder="Number"
              isInvalid={!!errors.number}
              // errorMessage={errors.number?.message}
              classNames={{
                input: 'pl-1',
              }}
            />
          )
        }}
      />

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
          {candidateInfo ? 'Update' : 'Submit'}
        </Button>
      </div>
    </Form>
  )
}
