import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import CustomError from '../utils/CustomError';

const prisma = new PrismaClient();

type createUserInput = {
  username: string;
  password: string;
};

export const createUserService = async (userData: createUserInput): Promise<User> => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: {
      username: userData.username,
      password: hashedPassword,
    },
  });

  return user;
};

export const loginUserService = async (userData: createUserInput): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: {
      username: userData.username,
    },
  });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const isPasswordCorrect = await bcrypt.compare(userData.password, user.password);

  if (!isPasswordCorrect) {
    throw new CustomError('Incorrect password', 401);
  }

  return user;
};
