import mongoose from 'mongoose';
import {Note} from '../../types/DBTypes';

const noteModel = new mongoose.Schema<Note>({
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
  content: {
    type: String,
    default: '',
    max: [10000, 'Content must be shorter than 10000 characters'],
  },
});

export default mongoose.model<Note>('Note', noteModel);
