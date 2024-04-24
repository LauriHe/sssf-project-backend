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
  },
  content: {
    type: String,
    default: '',
  },
});

export default mongoose.model<Note>('Note', noteModel);
