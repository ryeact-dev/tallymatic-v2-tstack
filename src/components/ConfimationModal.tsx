import { Modal, ModalContent, ModalHeader } from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import DeleteEventModalBody from './settings/events/delete-event/DeleteEventModalBody'
import DeleteUserModalBody from './settings/users/delete-user/DeleteUserModalBody'
import DeleteCompetitionModalBody from './settings/competitions/delete-competition/DeleteCompetitionModalBody'
import ResetPasswordModalBody from './settings/users/reset-password/ResetPasswordModalBody'
import type { DefaultDataModalObject } from '~/utils/types'
import { closeModal, modalStore } from '~/store'

export default function ConfimationModal() {
  const { isModalOpen, size, data } = useStore(modalStore)

  let body = <div />

  switch (data.type) {
    case 'delete-event':
      body = (
        <DeleteEventModalBody
          data={data.data as DefaultDataModalObject}
          onClose={closeModal}
        />
      )
      break

    case 'delete-user':
      body = (
        <DeleteUserModalBody
          data={data.data as DefaultDataModalObject}
          onClose={closeModal}
        />
      )
      break

    case 'delete-competition':
      body = (
        <DeleteCompetitionModalBody
          data={data.data as DefaultDataModalObject}
          onClose={closeModal}
        />
      )
      break

    case 'password-reset':
      body = (
        <ResetPasswordModalBody
          data={data.data as DefaultDataModalObject}
          onClose={closeModal}
        />
      )
      break

    default:
      body
  }

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isModalOpen}
      size={size}
      onClose={closeModal}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Confirmation</ModalHeader>
        {body}
      </ModalContent>
    </Modal>
  )
}
