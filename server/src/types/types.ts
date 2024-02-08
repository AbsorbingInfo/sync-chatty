import { UserPayload } from './UserControllerTypes';

/* eslint-disable */
declare global {
  namespace Express {
    interface Locals {
      user: UserPayload;
    }
  }
}
/* eslint-enable */
