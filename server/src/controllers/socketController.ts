import { Socket } from 'socket.io';
import { createRoom, joinRoom, sendMessage } from '../services/socketService';
import {
  createRoomSchema,
  joinRoomSchema,
  sendMessageSchema,
  reconnectRoom,
} from '../validationSchemas/socketValidations';
import { Prisma } from '@prisma/client';

export const handleSocketConnection = (socket: Socket) => {
  console.log('New socket connection:', socket.id, '---------------------------------------------');

  socket.on('createRoom', async data => {
    try {
      const validateData = await createRoomSchema.parse(data);
      console.log(validateData);
      await createRoom(validateData);
      socket.emit('roomCreated', { roomCode: validateData.roomCode, roomPassword: validateData.roomPassword });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          socket.emit('roomCodeExists', 'Room code already exists');
        }
      } else {
        console.error('Error creating room:', error);
      }
      console.log(error);
    }
  });

  socket.on('joinRoom', async data => {
    try {
      const validateData = joinRoomSchema.parse(data);
      const user = await joinRoom(validateData);
      socket.join(validateData.roomCode);
      socket.emit('joinedRoom', { roomCode: validateData.roomCode });
      socket.to(validateData.roomCode).emit('newUser', { username: user.username });
      console.log('room joined');
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        socket.emit('error', { error: error.message });
      }
    }
  });

  socket.on('sendMessage', async data => {
    try {
      const validateData = await sendMessageSchema.parse(data);
      const message = await sendMessage(validateData);
      socket.emit('broadcastMessage', { message, username: data.username });
      socket.to(data.roomCode).emit('broadcastMessage', { message, username: data.username });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        socket.emit('error', { error: error.message });
      }
    }
  });

  socket.on('checkRoom', roomId => {
    const isInRoom = socket.rooms.has(roomId);
    socket.emit('roomCheckResult', isInRoom);
  });

  socket.on('reconnectRoom', async data => {
    try {
      const validateData = reconnectRoom.parse(data);
      socket.join(validateData.roomCode);
      socket.emit('reconnectedRoom', { roomCode: validateData.roomCode });
    } catch (error) {
      if (error instanceof Error) {
        socket.emit('error', { error: error.message });
      }
    }
  });
};
