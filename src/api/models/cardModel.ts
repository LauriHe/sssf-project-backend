import mongoose from 'mongoose';
import {Card} from '../../types/DBTypes';

const cardModel = new mongoose.Schema<Card>({
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: [true, 'List is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    max: [100, 'Title must be shorter than 100 characters'],
  },
  content: {
    type: String,
    default: '',
    max: [5000, 'Content must be shorter than 10000 characters'],
  },
});

export default mongoose.model<Card>('Card', cardModel);
