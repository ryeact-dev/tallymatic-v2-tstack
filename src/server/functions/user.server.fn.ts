import { createServerFn } from '@tanstack/react-start';
import {
  createNewUserDb,
  deleteUserDb,
  getAllUsersDb,
  resetUserDb,
  toggleUserDb,
  updateUserDb,
} from '~/server/db-access/user.db.access';
import { authenticatedMiddleware } from '~/utils/middlewares';
import {
  createUserSchema,
  deleteUserSchema,
  resetUserPasswordSchema,
  toggleUserSchema,
  updateUserSchema,
  usersListSchema,
} from '~/zod/validator.schema';

export const getAllUsersServerFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(usersListSchema)
  .handler(async ({ context, data }) => {
    return await getAllUsersDb({
      page: data.page,
      limit: data.limit,
      filter: data.filter || '',
      user: context.user || '',
    });
  });

export const createUserServerFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(createUserSchema)
  .handler(async ({ context, data }) => {
    if (data.role === 'manager' && context.user.role !== 'admin') {
      return {
        success: false,
        message: 'You are not authorized to create a manager',
        user: null,
      };
    }

    return await createNewUserDb(data);
  });

export const updateUserServerFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(updateUserSchema)
  .handler(async ({ context, data }) => {
    if (data.role === 'manager' && context.user.role !== 'admin') {
      return {
        success: false,
        message: 'You are not authorized to update a manager',
        user: null,
      };
    }

    return await updateUserDb(data);
  });

export const toggleUserServerFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(toggleUserSchema)
  .handler(async ({ context, data }) => {
    if (data.role === 'manager' && context.user.role !== 'admin') {
      return {
        success: false,
        message: 'You are not authorized to update a manager',
        user: null,
      };
    }

    return await toggleUserDb({ id: data.id, isActive: data.isActive });
  });

export const resetUserPasswordServerFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(resetUserPasswordSchema)
  .handler(async ({ context, data }) => {
    if (data.role === 'manager' && context.user.role !== 'admin') {
      return {
        success: false,
        message: 'You are not authorized to update a manager',
        user: null,
      };
    }

    return await resetUserDb({ id: data.id, newPassword: data.newPassword });
  });

export const deleteUserServerFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(deleteUserSchema)
  .handler(async ({ context, data }) => {
    if (data.role === 'manager' && context.user.role !== 'admin') {
      return {
        success: false,
        message: 'You are not authorized to delete a manager',
        user: null,
      };
    }

    return await deleteUserDb({ id: data.id });
  });
