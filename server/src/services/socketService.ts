import { PrismaClient, Room } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createRoomType, joinRoomType, sendMessageType } from '../types/socketControllerTypes';

const prisma = new PrismaClient();

export const createRoom = async (room: createRoomType): Promise<Room> => {
  const hashedPassword = await bcrypt.hash(room.roomPassword, 10);
  console.log('room =>', room);
  const newRoom = await prisma.room.create({
    data: {
      roomId: room.roomCode,
      password: hashedPassword,
      hostId: room.userId,
    },
  });

  return newRoom;
};

export const joinRoom = async (credential: joinRoomType) => {
  const room = await prisma.room.findUnique({
    where: {
      roomId: credential.roomCode,
    },
  });

  if (!room) {
    throw new Error('Room not found');
  }

  const isPasswordCorrect = await bcrypt.compare(credential.roomPassword, room.password);
  if (!isPasswordCorrect) {
    throw new Error('Incorrect password');
  }

  const user = await prisma.user.update({
    where: {
      id: credential.userId,
    },
    data: {
      joinedRoomId: credential.roomCode,
    },
  });

  return user;
};

export const sendMessage = async (message: sendMessageType) => {
  const sentMessage = await prisma.message.create({
    data: {
      content: message.content,
      userId: message.userId,
      roomCode: message.roomCode,
    },
  });

  if (!sentMessage) {
    throw new Error('Failed to send message');
  }
  return sentMessage;
};
