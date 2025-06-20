import { ModalBody, ModalFooter } from '@heroui/react'
import type { DefaultDataModalObject } from '~/utils/types'
import ModalButtons from '~/components/modal-buttons/ModalButtons'
import { useDeleteUserMutation } from '~/hooks/user.hooks'

export default function DeleteUserModalBody({
  onClose,
  data,
}: {
  onClose: () => void
  data: DefaultDataModalObject
}) {
  const { mutate: deleteEventMutate, isPending: isDeletingEvent } =
    useDeleteUserMutation(onClose)

  const onDeleteHandler = () => {
    if (!data.id) return
    deleteEventMutate({ id: data.id, role: data.role || '' })
  }

  return (
    <>
      <ModalBody>
        <p>
          {`Deleting ${data.name}'s account will delete all the data associated with it.`}
        </p>
        <p>{`Are you sure you want to delete this ${data.name}'s account?`}</p>
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
