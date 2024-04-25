import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import uploadRoute from './routes/uploadRoute';
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'routes: upload',
  });
});

router.use('/upload', uploadRoute);
router.use('/auth', authRoute);
router.use('/users', userRoute);

export default router;
