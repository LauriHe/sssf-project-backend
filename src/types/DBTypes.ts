import {Document, Types} from 'mongoose';

type User = Partial<Document> & {
  id: Types.ObjectId | string;
  user_name: string;
  email: string;
  password: string;
  filename: string;
};

type UserInput = Omit<User, 'id'>;
type UserOutput = Omit<User, 'password'>;
type LoginUser = Omit<User, 'password'>;
type UserTest = Partial<User>;

type TokenContent = {
  token: string;
  user: UserOutput;
};

type Note = Partial<Document> & {
  id: Types.ObjectId | string;
  owner: Types.ObjectId | User;
  collaborators: Types.ObjectId[] | User[];
  title: string;
  content: string;
};

type NoteTest = Partial<Note>;

type Board = Partial<Document> & {
  id: Types.ObjectId | string;
  owner: User;
  collaborators: Types.ObjectId[] | User[];
  title: string;
};

type BoardTest = Partial<Board>;

type List = Partial<Document> & {
  id: Types.ObjectId | string;
  board: Board;
  title: string;
};

type ListTest = Partial<List>;

type Card = Partial<Document> & {
  id: Types.ObjectId | string;
  list: List;
  title: string;
  content: string;
};

type CardTest = Partial<Card>;

export {
  User,
  UserInput,
  UserOutput,
  LoginUser,
  UserTest,
  TokenContent,
  Note,
  NoteTest,
  Board,
  BoardTest,
  List,
  ListTest,
  Card,
  CardTest,
};
