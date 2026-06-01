import express from 'express';
import { getLeaderboard, Login, saveScore, Signup } from '../controller/userController.js';
import { requireAuth } from '../middleware/auth.middleware.js';
const userRouter = express.Router();

userRouter.post('/signup', Signup);
userRouter.post('/login', Login);
userRouter.post('/score', requireAuth, saveScore);
userRouter.get('/leaderboard', getLeaderboard);

 export default userRouter;
