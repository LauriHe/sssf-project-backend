import mongoose from 'mongoose';
import {Board} from '../../types/DBTypes';

const boardModel = new mongoose.Schema<Board>({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required'],
  },
  collaborators: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    max: [100, 'Title must be shorter than 100 characters'],
  },
});

export default mongoose.model<Board>('Board', boardModel);
