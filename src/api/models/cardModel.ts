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
  },
  content: {
    type: String,
    default: '',
  },
});

export default mongoose.model<Card>('Card', cardModel);
