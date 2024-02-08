import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../types/env';

type DecodedPayloadType = {
  id: string;
  username: string;
  roomId: string | null;
};
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Missing access token' });
    }

    const user = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as DecodedPayloadType;
    res.locals = { user };

    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: 'Invalid access token' });
  }
};
