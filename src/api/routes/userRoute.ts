import express from 'express';
import {
  //check,
  checkToken,
  userPost,
  userPut,
} from '../controllers/userController';
import {authenticate} from '../../middlewares';

const router = express.Router();

router.route('/').post(userPost).put(authenticate, userPut);

router.get('/token', authenticate, checkToken);

export default router;
