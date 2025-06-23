import { ModalBody, ModalFooter } from '@heroui/react'
import type { DefaultDataModalObject } from '~/utils/types'
import { useDeleteEventMutation } from '~/hooks/event.hook'
import ModalButtons from '~/components/ModalButtons'

export default function DeleteEventModalBody({
  onClose,
  data,
}: {
  onClose: () => void
  data: DefaultDataModalObject
}) {
  const { mutate: deleteEventMutate, isPending: isDeletingEvent } =
    useDeleteEventMutation(onClose)

  const onDeleteHandler = () => {
    if (!data.id) return
    deleteEventMutate({ id: data.id })
  }

  return (
    <>
      <ModalBody>
        <p>
          Deleting this event will delete all the data associated with this
          event.
        </p>
        <p>Are you sure you want to delete this event?</p>
      </ModalBody>
      <ModalFooter>
        <ModalButtons
          isLoading={isDeletingEvent}
          onClose={onClose}
          onConfirm={onDeleteHandler}
        />
      </ModalFooter>
    </>
  )
}
