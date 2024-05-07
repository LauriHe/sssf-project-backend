import {Request, Response, NextFunction} from 'express';
import {User, UserOutput} from '../../types/DBTypes';

import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcrypt';
import MessageResponse from '../../interfaces/MessageResponse';

const userPost = async (
  req: Request<{}, {}, Omit<User, 'id'>>,
  res: Response<
    MessageResponse & {user: Pick<User, 'id' | 'user_name' | 'email'>}
  >,
  next: NextFunction,
) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const response = await userModel.create(req.body);
    const user = {
      id: response._id,
      user_name: response.user_name,
      email: response.email,
    };

    const userMessage = {
      message: 'User added',
      user: user,
    };
    res.json(userMessage);
  } catch (error) {
    next(error);
  }
};

const userPut = async (
  req: Request<{}, {}, User>,
  res: Response<MessageResponse & {user: User}>,
  next: NextFunction,
) => {
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const user = await userModel
      .findByIdAndUpdate(req.body._id, req.body, {
        new: true,
      })
      .select('-password -__v');
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    const response = {
      message: 'User updated',
      user: user,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const checkToken = (
  req: Request,
  res: Response<UserOutput>,
  next: NextFunction,
) => {
  try {
    const user: UserOutput = {
      id: res.locals.user.id,
      user_name: res.locals.user.user_name,
      email: res.locals.user.email,
      filename: res.locals.user.filename,
    };
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export {userPost, userPut, checkToken};
