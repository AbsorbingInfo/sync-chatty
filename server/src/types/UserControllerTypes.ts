export type UserPayload = {
  id: string;
  username: string;
  roomId: string | null;
  iat: number;
  exp: number;
};
