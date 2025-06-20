import { Prisma } from '@prisma/client';
import { prisma } from '~/utils/prisma';
import { CurrentUser, UserWithEventAndCompetitions } from '~/utils/types';
import * as bcrypt from 'bcrypt';
import { replacer } from '~/helpers/server-helpers';

export async function getAllUsersDb({
  page,
  limit,
  filter,
  user,
}: {
  page: number;
  limit: number;
  filter: string;
  user: CurrentUser;
}) {
  let users = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      AND: [
        {
          eventId: user.event?.id,
          OR: [
            { username: { contains: filter } },
            { email: { contains: filter } },
          ],
        },
      ],
    },
    include: {
      competitions: true,
      event: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    omit: {
      password: true,
      createdAt: true,
    },
  });

  if (user.role === 'admin') {
    users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        OR: [
          { username: { contains: filter } },
          { email: { contains: filter } },
        ],
      },
      include: {
        competitions: true,
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        password: true,
        createdAt: true,
      },
    });
  }

  // Need to serialize the users array to JSON string before returning
  const json = JSON.stringify(users, replacer);

  return {
    success: true,
    message: 'Users fetched successfully',
    users: json,
  };
}

export async function createNewUserDb(
  user: Omit<UserWithEventAndCompetitions, 'createdAt' | 'isActive' | 'id'>
) {
  const userDefaultHashedPassword = bcrypt.hashSync(user.password, 10);

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: user.username.toLowerCase().trim(),
          },
          {
            judgeNumber: user.judgeNumber,
          },
        ],
      },
    });

    if (foundUser) {
      return {
        success: false,
        message: 'User number/username already exists',
        user: null,
      };
    }

    const newUser = await prisma.user.create({
      data: {
        username: user.username.toLowerCase().trim(),
        fullName: user.fullName,
        password: userDefaultHashedPassword,
        email: user.email,
        role: user.role,
        photo: user.photo,
        judgeNumber: user.role !== 'judge' ? 0 : user.judgeNumber,
        eventId: user.event.id,
      },
      include: {
        event: true,
      },
    });

    // Connect user to competions if there are any competitons added
    if (user.competitionIds && user.competitionIds?.length > 0) {
      const userCompetitionIds = user.competitionIds;

      for (const competitionId of userCompetitionIds) {
        await prisma.competition.update({
          where: {
            id: competitionId,
          },
          data: {
            users: {
              connect: {
                id: newUser.id,
              },
            },
          },
        });
      }
    }

    console.log(`${newUser.fullName}'s successfully created`);

    return {
      success: true,
      message: 'User created successfully',
      user: newUser,
    };
  } catch (error) {
    console.log(error);

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
      message: 'Error creating user',
      user: null,
    };
  }
}

export async function updateUserDb(
  user: Omit<
    UserWithEventAndCompetitions,
    'createdAt' | 'isActive' | 'password'
  >
) {
  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: user.username.toLowerCase().trim(),
          },
          {
            judgeNumber: user.judgeNumber,
          },
        ],
      },
    });

    if (foundUser && foundUser.id !== user.id) {
      return {
        success: false,
        message: 'User number/username already exists',
        user: null,
      };
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: user.username.toLowerCase().trim(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        photo: user.photo,
        judgeNumber: user.judgeNumber,
        eventId: user.event.id,
      },
      include: {
        event: true,
      },
    });

    const eventCompetitions = await prisma.competition.findMany({
      where: {
        eventId: user.event.id,
      },
      select: {
        id: true,
      },
    });

    const eventCompetitionIds = eventCompetitions.map(
      (competition) => competition.id
    );

    // Connect user to competions if there are any competitons added
    if (user.competitionIds && user.competitionIds?.length > 0) {
      const userCompetitionIds = user.competitionIds;

      for (const competitionId of userCompetitionIds) {
        if (eventCompetitionIds.includes(competitionId)) {
          // Connect user to competition
          await prisma.competition.update({
            where: {
              id: competitionId,
            },
            data: {
              users: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
        } else {
          // Disconnect user from competition
          await prisma.competition.update({
            where: { id: competitionId },
            data: {
              users: {
                disconnect: [{ id: user.id }],
              },
            },
          });
        }
      }
    }

    console.log(`${updatedUser.fullName}'s successfully updated`);

    return {
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    };
  } catch (error) {
    console.log(error);

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
      message: 'Error updating user',
      user: null,
    };
  }
}

export async function resetUserDb({
  id,
  newPassword,
}: {
  id: string;
  newPassword: string;
}) {
  const userNewHashedPassword = bcrypt.hashSync(newPassword, 10);

  try {
    const resettedUserPassword = await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: userNewHashedPassword,
      },
    });

    console.log(`${resettedUserPassword.fullName}'s password was resetted`);

    return {
      success: true,
      message: 'User password sucessfully resetted',
      user: null,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Error resetting user password',
      user: null,
    };
  }
}

export async function toggleUserDb({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  try {
    const toggledUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });

    console.log(
      `${toggledUser.fullName}'s account was ${toggledUser.isActive ? 'activated' : 'deactivated'}`
    );

    return {
      success: true,
      message: 'User status sucessfully update',
      user: null,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Error updating user status',
      user: null,
    };
  }
}

export async function deleteUserDb({ id }: { id: string }) {
  try {
    const deleteUser = await prisma.user.delete({
      where: {
        id,
      },
    });

    console.log(`${deleteUser.fullName}'s account was deleted`);

    return {
      success: true,
      message: 'User successfully deleted',
      user: null,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Error deleting user',
      user: null,
    };
  }
}
