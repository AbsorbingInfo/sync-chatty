import express, { Express, Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8000;
const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
import routes from './routes';
import socketRoutes from './routes/socketRoutes';

app.get('/', (req: Request, res: Response) => {
  res.send('<center><h1>Sync Chatty</h1></center>');
});
app.use('/api', routes);

socketRoutes(io);

io.on('connection', (socket: Socket) => {
  console.log(socket.id);
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
