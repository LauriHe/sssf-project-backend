import mongoose from 'mongoose';
import {List} from '../../types/DBTypes';

const listModel = new mongoose.Schema<List>({
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: [true, 'Board is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
});

export default mongoose.model<List>('List', listModel);
