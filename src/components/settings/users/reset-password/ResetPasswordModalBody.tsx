import { Button, Input, ModalBody, ModalFooter } from '@heroui/react'
import { useState } from 'react'
import type { DefaultDataModalObject } from '~/utils/types'
import { randomPasswordGenerator } from '~/helpers/random-password-generator'

import { useResetUserPasswordMutation } from '~/hooks/user.hooks'
import ToastNotification from '~/components/toast-notification/ToastNotification'
import ModalButtons from '~/components/ModalButtons'

export default function ResetPasswordModalBody({
  data,
  onClose,
}: {
  onClose: () => void
  data: DefaultDataModalObject
}) {
  const [userPassword, setUserPassword] = useState(randomPasswordGenerator())
  const [username, setUsername] = useState<string>('')

  const { mutate: passwordResetMutate, isPending: isResettingPassword } =
    useResetUserPasswordMutation(onClose)

  const onSubmit = () => {
    if (data.username?.trim() !== username.trim()) {
      ToastNotification({
        color: 'danger',
        title: 'Reset user password',
        description: 'Emails are not match',
      })
      return
    }

    passwordResetMutate({
      id: data.id,
      newPassword: userPassword,
      role: data.role || '',
    })
  }

  return (
    <>
      <ModalBody>
        <div>
          <p>
            Please re-type{' '}
            <span className="font-semibold">{data.username}</span> to confirm
            user password reset
          </p>

          <Input
            label="Username"
            labelPlacement="outside"
            placeholder="Enter user username"
            onChange={(e) => setUsername(e.target.value)}
            // isInvalid={!!errors.newPassword}
            // errorMessage={errors.number?.message}
            classNames={{
              input: 'pl-1 lowercase ',
              base: 'pt-4',
            }}
          />
        </div>

        <div>
          <p className="text-sm">New Password</p>
          <div className="flex items-center justify-between border rounded-xl px-4 py-2">
            <p className="text-lg">{userPassword}</p>
            <Button
              color="primary"
              onPress={() => setUserPassword(randomPasswordGenerator())}
              size="sm"
              variant="flat"
            >
              Generate New Password
            </Button>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <ModalButtons
          isLoading={isResettingPassword}
          onClose={onClose}
          onConfirm={onSubmit}
        />
      </ModalFooter>
    </>
  )
}
