// Description: This file contains the functions for the user routes
// TODO: add function check, to check if the server is alive
// TODO: add function to get all users
// TODO: add function to get a user by id
// TODO: add function to create a user
// TODO: add function to update a user
// TODO: add function to delete a user
// TODO: add function to check if a token is valid
import {Request, Response, NextFunction} from 'express';
import {User, UserOutput} from '../../types/DBTypes';

import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcrypt';
import MessageResponse from '../../interfaces/MessageResponse';

const userListGet = async (
  req: Request,
  res: Response<User[]>,
  next: NextFunction,
) => {
  try {
    const users = await userModel.find().select('-password -__v');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<User>,
  next: NextFunction,
) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select('-password -__v');
    if (!user) {
      throw new CustomError('No species found', 404);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

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
  req: Request<{id: string}, {}, Omit<User, 'user_id'>>,
  res: Response<MessageResponse & {data: User}>,
  next: NextFunction,
) => {
  try {
    const user = await userModel
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      .select('-password -__v');
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    const response = {
      message: 'User updated',
      data: user,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const userDelete = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<MessageResponse>,
  next: NextFunction,
) => {
  try {
    const user = await userModel
      .findByIdAndDelete(req.params.id)
      .select('-password -__v');
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    res.json({message: 'User deleted'});
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
      id: res.locals.user._id,
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

export {userListGet, userGet, userPost, userPut, userDelete, checkToken};
