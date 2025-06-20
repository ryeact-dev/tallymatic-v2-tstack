import { Event, Prisma } from '@prisma/client';
import { EventFormValues } from '~/zod/form.schema';
import { prisma } from '~/utils/prisma';

export async function getAllEventsDb({
  page,
  limit,
  filter,
}: {
  page: number;
  limit: number;
  filter: string;
}) {
  const events = await prisma.event.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      OR: [{ name: { contains: filter } }],
    },
    include: {
      user: {
        omit: {
          password: true,
          createdAt: true,
          email: true,
        },
      },
    },
  });

  return {
    success: true,
    message: 'Events successfully fetched',
    events,
  };
}

export async function createEventDb(data: EventFormValues) {
  try {
    const event = await prisma.event.create({
      data: {
        ...data,
        eventDate: new Date(data.eventDate),
      },
    });

    console.log(`${event.name}'s successfully created`);

    return {
      success: true,
      message: 'Event successfully created',
      event,
    };
  } catch (error) {
    console.log(error);

    // Handle duplicate key error
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      const prismaError = error as Prisma.PrismaClientKnownRequestError;
      const target =
        (prismaError.meta as { target?: string[] })?.target?.[0] ?? 'Field';

      return {
        success: false,
        message: `${target} already exists`,
        event: null,
      };
    }

    return {
      success: false,
      message: 'Event creation failed',
      event: null,
    };
  }
}

export async function updateEventDb(data: Omit<Event, 'createdAt'>) {
  try {
    const event = await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        eventDate: new Date(data.eventDate),
      },
    });

    console.log(`${event.name}'s successfully updated`);

    return {
      success: true,
      message: 'Event successfully updated',
      event,
    };
  } catch (error) {
    console.log(error);

    // Handle duplicate key error
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      const prismaError = error as Prisma.PrismaClientKnownRequestError;
      const target =
        (prismaError.meta as { target?: string[] })?.target?.[0] ?? 'Field';

      return {
        success: false,
        message: `${target} already exists`,
        event: null,
      };
    }

    return {
      success: false,
      message: 'Event update failed',
      event: null,
    };
  }
}

export async function deleteEventDb({ id }: { id: string }) {
  try {
    const eventUsers = await prisma.user.findMany({
      where: {
        eventId: id,
      },
      select: {
        id: true,
      },
    });

    if (eventUsers.length > 0) {
      return {
        success: false,
        message:
          'Event has users associated with it. Please delete users first.',
        event: null,
      };
    }

    const deletedEvent = await prisma.event.delete({
      where: { id },
    });

    console.log(`${deletedEvent.name}'s successfully deleted`);

    return {
      success: true,
      message: 'Event successfully deleted',
      event: null,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: 'Event delete failed',
      event: null,
    };
  }
}
