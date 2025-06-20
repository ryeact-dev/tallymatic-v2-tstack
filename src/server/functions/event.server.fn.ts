import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import {
  createEventDb,
  deleteEventDb,
  getAllEventsDb,
  updateEventDb,
} from '~/server/db-access/event.db.access';
import { eventSchema } from '~/zod/form.schema';
import { adminMiddleware } from '~/utils/middlewares';
import {
  baseValidationSchema,
  updateEventSchema,
} from '~/zod/validator.schema';

export const getAllEventsServerFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(baseValidationSchema)
  .handler(async ({ data }) => {
    return await getAllEventsDb({
      page: data.page,
      limit: data.limit,
      filter: data.filter || '',
    });
  });

export const createEventServerFn = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(eventSchema)
  .handler(async ({ data }) => {
    return await createEventDb(data);
  });

export const updateEventServerFn = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(updateEventSchema)
  .handler(async ({ data }) => {
    return await updateEventDb(data);
  });

export const deleteEventServerFn = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    return await deleteEventDb(data);
  });
