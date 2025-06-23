import { ModalBody, ModalFooter } from '@heroui/react'
import type { DefaultDataModalObject } from '~/utils/types'
import { useDeleteCandidateMutation } from '~/hooks/candidate.hook'
import ModalButtons from '~/components/ModalButtons'

export default function DeleteCandidateModalBody({
  onClose,
  data,
}: {
  onClose: () => void
  data: DefaultDataModalObject
}) {
  const { mutate, isPending } = useDeleteCandidateMutation(onClose)

  const onDeleteHandler = () => {
    if (!data.id) return
    mutate({ id: data.id })
  }

  return (
    <>
      <ModalBody>
        <p>
          Deleting <span className="font-semibold">{data.name}'s</span> data
          will remove all of their data from the system.
        </p>
      </ModalBody>
      <ModalFooter>
        <ModalButtons
          isLoading={isPending}
          onClose={onClose}
          onConfirm={onDeleteHandler}
        />
      </ModalFooter>
    </>
  )
}
