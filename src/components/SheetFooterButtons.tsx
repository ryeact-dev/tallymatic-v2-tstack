import { Button } from '@heroui/react'
import { SquarePenIcon, XIcon } from 'lucide-react'

export default function SheetFooterButtons({
  onClose,
  isLoading,
  data,
}: {
  onClose: () => void
  isLoading: boolean
  data: any | null
}) {
  return (
    <div className="flex justify-end gap-4 w-full mt-8">
      <Button
        color="danger"
        type="button"
        variant="light"
        onPress={onClose}
        disabled={isLoading}
      >
        <XIcon size={18} /> Cancel
      </Button>
      <Button
        disabled={isLoading}
        isLoading={isLoading}
        color="primary"
        type="submit"
        className="w-40"
      >
        <SquarePenIcon size={18} /> {data ? 'Update' : 'Submit'}
      </Button>
    </div>
  )
}
