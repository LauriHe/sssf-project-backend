import mongoose from 'mongoose';
import {User} from '../../types/DBTypes';

const userModel = new mongoose.Schema<User>({
  user_name: {
    type: String,
    required: [true, 'User name is required'],
    min: [2, 'User name must be at least 2 characters'],
    max: [100, 'User name must be shorter than 100 characters'],
  },
  email: {
    type: String,
    validate: {
      validator: (v: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(v);
      },
      message: (props: {value: string}) =>
        `${props.value} is not a valid email!`,
    },
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    min: [6, 'Password must be at least 6 characters'],
    max: [100, 'Password must be shorter than 100 characters'],
  },
  filename: {
    type: String,
    default: '',
    max: [100, 'Filename must be shorter than 100 characters'],
  },
});

export default mongoose.model<User>('User', userModel);
