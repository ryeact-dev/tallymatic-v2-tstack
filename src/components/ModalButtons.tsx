import { Button } from '@heroui/button'
import { SendIcon, XIcon } from 'lucide-react'

export default function ModalButtons({
  onClose,
  isLoading,
  onConfirm,
}: {
  onClose: () => void
  isLoading: boolean
  onConfirm: () => void
}) {
  return (
    <div className="flex gap-4 justify-end">
      <Button
        color="danger"
        variant="light"
        onPress={onClose}
        isDisabled={isLoading}
        type="button"
      >
        <XIcon size={18} /> Cancel
      </Button>
      <Button
        color="primary"
        onPress={onConfirm}
        isLoading={isLoading}
        isDisabled={isLoading}
        type="submit"
        className="w-36"
      >
        {isLoading ? (
          'Deleting'
        ) : (
          <>
            <SendIcon size={18} /> Confirm
          </>
        )}
      </Button>
    </div>
  )
}
