export type createRoomType = {
  roomCode: string;
  roomPassword: string;
  userId: string;
};

export type joinRoomType = {
  userId: string;
  roomCode: string;
  roomPassword: string;
};

export type sendMessageType = {
  username: string;
  content: string;
  userId: string;
  roomCode: string;
};
