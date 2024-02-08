import express from 'express';
import { registerUserController, loginUserController, isLoggedInController } from '../controllers/userController';

const router = express.Router();

router.post('/signup', registerUserController);
router.post('/login', loginUserController);
router.get('/isLoggedIn', isLoggedInController);

export default router;
