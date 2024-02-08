import { Server } from 'socket.io';
import { handleSocketConnection } from '../controllers/socketController';
const socketRoutes = (io: Server) => {
  io.on('connection', socket => {
    handleSocketConnection(socket);
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};

export default socketRoutes;
