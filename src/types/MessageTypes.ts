import {Board, Card, List, Note, UserOutput} from './DBTypes';

type MessageResponse = {
  message: string;
};

type UploadResponse = MessageResponse & {
  filename: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type UserMessage = Partial<Document> & {
  message: string;
  user?: UserOutput;
};

type LoginMessage = Partial<Document> & {
  message: string;
  token?: string;
  user?: UserOutput;
};

type NoteMessage = Partial<Document> & {
  message: string;
  note?: Note;
};

type BoardMessage = Partial<Document> & {
  message: string;
  board?: Board;
};

type ListMessage = Partial<Document> & {
  message: string;
  list?: List;
};

type CardMessage = Partial<Document> & {
  message: string;
  card?: Card;
};

export {
  ErrorResponse,
  UploadResponse,
  UserMessage,
  LoginMessage,
  NoteMessage,
  BoardMessage,
  ListMessage,
  CardMessage,
};
