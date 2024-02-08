import { z } from 'zod';

export const createRoomSchema = z.object({
  roomCode: z.string().min(6).max(6),
  roomPassword: z.string(),
  userId: z.string(),
});

export const joinRoomSchema = z.object({
  userId: z.string(),
  roomCode: z.string().min(6).max(6),
  roomPassword: z.string(),
});

export const sendMessageSchema = z.object({
  username: z.string(),
  content: z.string(),
  userId: z.string(),
  roomCode: z.string(),
});

export const reconnectRoom = z.object({
  roomCode: z.string(),
});
