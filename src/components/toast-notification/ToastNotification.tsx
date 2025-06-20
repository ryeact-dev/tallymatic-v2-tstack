import { addToast } from '@heroui/toast';

interface ToastNotificationProps {
  title: string;
  description: string;
  color: string;
}

const allowedColors = [
  'default',
  'foreground',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
] as const;

type ToastColor = (typeof allowedColors)[number];

export default function ToastNotification({
  title,
  description,
  color,
}: ToastNotificationProps) {
  const normalizedColor = color?.toLowerCase() as ToastColor | undefined;
  const safeColor = allowedColors.includes(normalizedColor as ToastColor)
    ? normalizedColor
    : undefined;

  return addToast({
    title: title ?? 'Toast title',
    description: description ?? 'Toast displayed successfully',
    color: safeColor,
  });
}
