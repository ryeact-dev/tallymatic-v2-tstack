import { Button, Form, Input, useDisclosure } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRouteApi } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
import { useCallback } from 'react'
import { CameraOff, PlusCircleIcon } from 'lucide-react'

import type { CandidateNoCreatedAt } from '~/utils/types'
import type { SubmitHandler } from 'react-hook-form'
import type { CandidateFormValues } from '~/zod/form.schema'
import { candidateBaseSchema } from '~/zod/form.schema'
import ImageCropperModal from '~/components/image-cropper/ImageCropper'
import {
  updateCandidateMutation,
  useCreateCandidateMutation,
} from '~/hooks/candidate.hook'
import { cn } from '~/utils/cn'
import SheetFooterButtons from '~/components/SheetFooterButtons'

interface CandidateFormProps {
  onClose: () => void
  candidateInfo: CandidateNoCreatedAt | null
}

const routeApi = getRouteApi('/settings/candidates')

export default function AddCandidateSheetBody({
  onClose,
  candidateInfo,
}: CandidateFormProps) {
  const { user } = routeApi.useRouteContext()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const DEFAULT_VALUES: CandidateFormValues = {
    fullName: '',
    number: 0,
    course: '',
    photo: '',
    eventId: user?.event?.id || '',
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateBaseSchema),
    defaultValues: candidateInfo ? candidateInfo : DEFAULT_VALUES,
  })

  const onResetForm = () => {
    reset(DEFAULT_VALUES)
  }

  const { mutate: createCandidateMutate, isPending: isCreatingCandidate } =
    useCreateCandidateMutation(onResetForm, onClose)

  const { mutate: updateCandidateMutate, isPending: isUpdatingCandidate } =
    updateCandidateMutation(onResetForm, onClose)

  const onSubmit: SubmitHandler<CandidateFormValues> = (data) => {
    const newUserData = {
      ...data,
      id: candidateInfo?.id || '',
    }

    if (candidateInfo) {
      updateCandidateMutate(newUserData)
    } else {
      createCandidateMutate(newUserData)
    }
  }

  const candidateImage = watch('photo')

  const onImageChangeHandler = useCallback(
    (url: string | null) => {
      if (!url) return
      console.log(url)
      setValue('photo', url)
    },
    [setValue],
  )

  console.log(errors)

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div
          className={cn(
            'relative w-full h-[420px] flex items-center justify-center border rounded-lg overflow-hidden',
            errors.photo && 'border-danger',
          )}
        >
          {candidateImage ? (
            <img
              src={candidateImage}
              alt="candidate-image"
              className=" object-center object-cover"
            />
          ) : (
            <CameraOff
              size={72}
              strokeWidth={1.5}
              className={cn(errors.photo && 'text-danger')}
            />
          )}

          <Button
            className="absolute bottom-0 right-0 m-2"
            color="danger"
            onPress={onOpen}
          >
            <PlusCircleIcon size={20} /> Add Image
          </Button>
        </div>

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
                  input: 'pl-1',
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

        <SheetFooterButtons
          data={candidateInfo}
          onClose={onClose}
          isLoading={isCreatingCandidate || isUpdatingCandidate}
        />
      </Form>
      <ImageCropperModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        setCroppedImage={onImageChangeHandler}
      />
    </>
  )
}
