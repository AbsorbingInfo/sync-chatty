import { Request, Response } from 'express';
import { userSchema } from '../validationSchemas/userValidation';
import { createUserService, loginUserService } from '../services/userService';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import CustomError from '../utils/CustomError';
import jwt from 'jsonwebtoken';
import { env } from '../types/env';
import { UserPayload } from '../types/UserControllerTypes';

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const validateData = await userSchema.parse(req.body);

    const user = await createUserService(validateData);

    const tokenPayload = {
      id: user.id,
      username: user.username,
      roomId: user.joinedRoomId,
    };

    const accessToken = jwt.sign(tokenPayload, env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });

    res.cookie('token', accessToken, { httpOnly: true });
    res.status(200).json({ user: tokenPayload });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.errors[0].message });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(400).json({ message: 'Username already exists' });
      }
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const validateData = await userSchema.parse(req.body);
    const user = await loginUserService(validateData);

    const tokenPayload = {
      id: user.id,
      username: user.username,
      roomId: user.joinedRoomId,
    };

    const accessToken = jwt.sign(tokenPayload, env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });

    res.cookie('token', accessToken, { httpOnly: true });
    res.status(200).json({ user: tokenPayload });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.errors[0].message });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(400).json({ message: 'Username already exists' });
      }
    } else if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const isLoggedInController = async (req: Request, res: Response) => {
  try {
    const token = req.cookies['token'];
    if (!token) {
      res.status(401).json({ isLoggedIn: false });
      return;
    }
    const userPayload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as UserPayload;
    if (userPayload.exp < new Date().getTime() / 1000) {
      res.status(401).json({ isLoggedIn: false });
      return;
    }
    const user = {
      id: userPayload.id,
      username: userPayload.username,
      roomId: userPayload.roomId,
    };
    res.status(200).json({ isLoggedIn: true, user });
  } catch (error) {
    console.log(error);
  }
};
