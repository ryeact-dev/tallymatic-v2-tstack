import { ModalBody, ModalFooter } from '@heroui/react'
import type { DefaultDataModalObject } from '~/utils/types'
import { useDeleteCompetitionMutation } from '~/hooks/competition.hook'
import ModalButtons from '~/components/modal-buttons/ModalButtons'

export default function DeleteCompetitionModalBody({
  onClose,
  data,
}: {
  onClose: () => void
  data: DefaultDataModalObject
}) {
  const { mutate: deleteCompetitionMutate, isPending: isDeletingCompetition } =
    useDeleteCompetitionMutation(onClose)

  const onDeleteHandler = () => {
    if (!data.id) return
    deleteCompetitionMutate({ id: data.id })
  }

  return (
    <>
      <ModalBody>
        <p>Deleting {data.name}?</p>
      </ModalBody>
      <ModalFooter>
        <ModalButtons
          isLoading={isDeletingCompetition}
          onClose={onClose}
          onConfirm={onDeleteHandler}
        />
      </ModalFooter>
    </>
  )
}
