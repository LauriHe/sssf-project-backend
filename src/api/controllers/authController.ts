import {Request, Response, NextFunction} from 'express';
import {UserOutput} from '../../types/DBTypes';
import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import MessageResponse from '../../interfaces/MessageResponse';

const login = async (
  req: Request<{}, {}, {user_name: string; password: string}>,
  res: Response<MessageResponse & {token: string; user: UserOutput}>,
  next: NextFunction,
) => {
  try {
    const {user_name, password} = req.body;
    const user = await userModel.findOne({user_name: user_name});
    if (!user) {
      throw new CustomError('username or password incorrect', 404);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new CustomError('username or password incorrect', 404);
    }

    if (!process.env.JWT_SECRET) {
      throw new CustomError('JWT secret not set', 500);
    }

    const userWithoutPassword: UserOutput = {
      id: user._id,
      email: user.email,
      user_name: user.user_name,
      filename: user.filename,
    };

    const tokenContent: UserOutput = {
      id: user._id,
      email: user.email,
      user_name: user.user_name,
      filename: user.filename,
    };

    const token = jwt.sign(tokenContent, process.env.JWT_SECRET);

    res.json({message: 'Login successful', token, user: userWithoutPassword});
  } catch (error) {
    next(error);
  }
};

export {login};
