import { Prisma } from '~/generated/prisma/client';

export function replacer(key: string, value: unknown) {
  if (value instanceof Prisma.Decimal) {
    return value.toString();
  }
  return value;
}
