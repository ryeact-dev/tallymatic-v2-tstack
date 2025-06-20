import { Button } from '@heroui/button';

export default function ModalButtons({
  onClose,
  isLoading,
  onConfirm,
}: {
  onClose: () => void;
  isLoading: boolean;
  onConfirm: () => void;
}) {
  return (
    <>
      <Button
        color='danger'
        variant='light'
        onPress={onClose}
        isDisabled={isLoading}
        type='button'
      >
        Close
      </Button>
      <Button
        color='primary'
        onPress={onConfirm}
        isLoading={isLoading}
        isDisabled={isLoading}
        type='submit'
      >
        Confirm
      </Button>
    </>
  );
}
