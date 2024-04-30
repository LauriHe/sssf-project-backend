import app from '../src/app';
import mongoose from 'mongoose';
import {getNotFound} from './testFunctions';
import {
  getUser,
  getSingleUser,
  getUserByName,
  loginUser,
  postFile,
  postUser,
  putUser,
  deleteUser,
} from './userFunctions';
import {
  getSingleNote,
  getOwnedNotes,
  getSharedNotes,
  createNote,
  updateNote,
  deleteNote,
} from './noteFunctions';
import {
  getBoard,
  getOwnedBoards,
  getSharedBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  shareBoard,
  unshareBoard,
} from './boardFunctions';
import {
  getSingleList,
  getListsByBoard,
  createList,
  updateList,
  deleteList,
} from './listFunctions';
import {
  getSingleCard,
  getCardsByList,
  createCard,
  updateCard,
  deleteCard,
} from './cardFunctions';

const uploadApp = process.env.UPLOAD_URL as string;
import randomstring from 'randomstring';
import jwt from 'jsonwebtoken';
import {LoginMessage} from '../src/types/MessageTypes';
import {
  UserTest,
  NoteTest,
  BoardTest,
  ListTest,
  CardTest,
} from '../src/types/DBTypes';

describe('Testing graphql api', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // test not found
  it('responds with a not found message', async () => {
    await getNotFound(app);
  });

  //test create user
  let userData: LoginMessage;
  let userData2: LoginMessage;

  const testUser: UserTest = {
    user_name: randomstring.generate(7),
    email: randomstring.generate(9) + '@user.fi',
    password: 'testpassword',
    filename: '',
  };

  const testUser2: UserTest = {
    user_name: 'Test User ' + randomstring.generate(7),
    email: randomstring.generate(9) + '@user.fi',
    password: 'testpassword',
    filename: '',
  };

  it('should post a image', async () => {
    const fileResult1 = await postFile(uploadApp);
    testUser.filename = fileResult1.filename;
  });

  it('should post a second image', async () => {
    const fileResult2 = await postFile(uploadApp);
    testUser2.filename = fileResult2.filename;
  });

  it('should create a new user', async () => {
    await postUser(app, testUser);
  });

  it('should create second user', async () => {
    await postUser(app, testUser2);
  });

  it('should login user', async () => {
    const vars = {
      credentials: {
        user_name: testUser.user_name!,
        password: testUser.password!,
      },
    };
    userData = await loginUser(app, vars);
  });

  it('should login second user', async () => {
    const vars = {
      credentials: {
        user_name: testUser2.user_name!,
        password: testUser2.password!,
      },
    };
    userData2 = await loginUser(app, vars);
  });

  it('verify token', async () => {
    const dataFromToken = jwt.verify(
      userData.token!,
      process.env.JWT_SECRET as string,
    );
    expect(dataFromToken).toHaveProperty('user_name');
  });

  it('should return array of users', async () => {
    await getUser(app);
  });

  it('should return single user', async () => {
    if (!userData.user) throw new Error('No user in response');
    await getSingleUser(app, userData.user.id!);
  });

  it('should return user by name', async () => {
    if (!userData.user) throw new Error('No user in response');
    await getUserByName(app, userData.user.user_name!);
  });

  it('should update user', async () => {
    await putUser(app, userData.token!);
  });

  // test post note

  let noteUploadData: NoteTest;

  const noteData = {
    title: 'Test Note' + randomstring.generate(7),
    content: randomstring.generate(20),
  };

  let noteID1: string;
  it('should post a note', async () => {
    noteUploadData = await createNote(
      app,
      noteData.title,
      noteData.content,
      userData.token!,
    );
    noteID1 = noteUploadData.id;
  });

  it('should return single note', async () => {
    await getSingleNote(app, noteID1, userData.token!);
  });

  it('should return owned notes', async () => {
    await getOwnedNotes(app, userData.token!);
  });

  it('should return shared notes', async () => {
    await getSharedNotes(app, userData.token!);
  });

  it('should update note', async () => {
    await updateNote(
      app,
      noteID1,
      noteData.title + ' Updated',
      noteData.content + ' Updated',
      userData.token!,
    );
  });

  it('should delete note', async () => {
    await deleteNote(app, noteID1, userData.token!);
  });

  // test post board

  let boardUploadData: BoardTest;

  const boardData = {
    title: 'Test Board' + randomstring.generate(7),
  };

  let boardID1: string;
  it('should post a board', async () => {
    boardUploadData = await createBoard(app, boardData.title, userData.token!);
    boardID1 = boardUploadData.id;
  });

  it('should return single board', async () => {
    await getBoard(app, boardID1, userData.token!);
  });

  it('should return owned boards', async () => {
    await getOwnedBoards(app, userData.token!);
  });

  it('should return shared boards', async () => {
    await getSharedBoards(app, userData.token!);
  });

  it('should update board', async () => {
    await updateBoard(
      app,
      boardID1,
      boardData.title + ' Updated',
      userData.token!,
    );
  });

  it('should share board', async () => {
    if (!userData2.user) throw new Error('No user in response');
    await shareBoard(app, boardID1, userData2.user.id!, userData.token!);
  });

  it('should unshare board', async () => {
    if (!userData2.user) throw new Error('No user in response');
    await unshareBoard(app, boardID1, userData2.user.id!, userData.token!);
  });

  // test post list

  let listUploadData: ListTest;

  const listData = {
    title: 'Test List' + randomstring.generate(7),
  };

  let listID1: string;
  it('should post a list', async () => {
    listUploadData = await createList(
      app,
      listData.title,
      boardID1,
      userData.token!,
    );
    listID1 = listUploadData.id;
  });

  it('should return single list', async () => {
    await getSingleList(app, listID1, userData.token!);
  });

  it('should return lists by board', async () => {
    await getListsByBoard(app, boardID1, userData.token!);
  });

  it('should update list', async () => {
    await updateList(
      app,
      listID1,
      listData.title + ' Updated',
      userData.token!,
    );
  });

  // test post card

  let cardUploadData: CardTest;

  const cardData = {
    title: 'Test Card' + randomstring.generate(7),
    content: randomstring.generate(20),
  };

  let cardID1: string;
  it('should post a card', async () => {
    cardUploadData = await createCard(
      app,
      listID1,
      cardData.title,
      cardData.content,
      userData.token!,
    );
    cardID1 = cardUploadData.id;
  });

  it('should return single card', async () => {
    await getSingleCard(app, cardID1, userData.token!);
  });

  it('should return cards by list', async () => {
    await getCardsByList(app, listID1, userData.token!);
  });

  it('should update card', async () => {
    await updateCard(
      app,
      cardID1,
      cardData.title + ' Updated',
      cardData.content + ' Updated',
      userData.token!,
    );
  });

  it('should delete card', async () => {
    await deleteCard(app, cardID1, userData.token!);
  });

  // delete list

  it('should delete list', async () => {
    await deleteList(app, listID1, userData.token!);
  });

  // delete board

  it('should delete board', async () => {
    await deleteBoard(app, boardID1, userData.token!);
  });

  // delete user

  it('should delete user', async () => {
    await deleteUser(app, userData.token!);
  });
});
