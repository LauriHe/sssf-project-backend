/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import {Application} from 'express';
import {BoardTest} from '../src/types/DBTypes';

// add test for graphql query
/*
  BoardById($boardId: ID!) {
    boardById(id: $boardId) {
      id
      title
      owner {
        id
        user_name
        email
        filename
      }
      collaborators {
        id
        user_name
        email
        filename
      }
    }
  }
*/

const getBoard = (
  url: string | Application,
  id: string,
  token: string,
): Promise<BoardTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query BoardById($boardId: ID!) {
          boardById(id: $boardId) {
            id
            title
            owner {
              id
              user_name
              email
              filename
            }
            collaborators {
              id
              user_name
              email
              filename
            }
          }
        }`,
        variables: {
          boardId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const board = response.body.data.boardById;
          expect(board.id).toBe(id);
          expect(board).toHaveProperty('title');
          expect(board).toHaveProperty('owner');
          expect(board.owner).toHaveProperty('id');
          expect(board).toHaveProperty('collaborators');
          expect(board.collaborators).toBeInstanceOf(Array);
          resolve(board);
        }
      });
  });
};

// add test for graphql query
/*
  OwnedBoards {
    ownedBoards {
      id
      title
      owner {
        id
        user_name
        email
        filename
      }
      collaborators {
        id
        user_name
        email
        filename
      }
    }
  }
*/

const getOwnedBoards = (
  url: string | Application,
  token: string,
): Promise<BoardTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `{
          ownedBoards {
            id
            title
            owner {
              id
              user_name
              email
              filename
            }
            collaborators {
              id
              user_name
              email
              filename
            }
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const boards = response.body.data.ownedBoards;
          expect(boards).toBeInstanceOf(Array);
          boards.forEach((board: BoardTest) => {
            expect(board).toHaveProperty('id');
            expect(board).toHaveProperty('title');
            expect(board).toHaveProperty('owner');
            expect(board.owner).toHaveProperty('id');
            expect(board).toHaveProperty('collaborators');
            expect(board.collaborators).toBeInstanceOf(Array);
          });
          resolve(boards);
        }
      });
  });
};

// add test for graphql query
/*
  SharedBoards {
    sharedBoards {
      id
      title
      owner {
        id
        user_name
        email
        filename
      }
      collaborators {
        id
        user_name
        email
        filename
      }
    }
  }
*/

const getSharedBoards = (
  url: string | Application,
  token: string,
): Promise<BoardTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `{
          sharedBoards {
            id
            title
            owner {
              id
              user_name
              email
              filename
            }
            collaborators {
              id
              user_name
              email
              filename
            }
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const boards = response.body.data.sharedBoards;
          expect(boards).toBeInstanceOf(Array);
          boards.forEach((board: BoardTest) => {
            expect(board).toHaveProperty('id');
            expect(board).toHaveProperty('title');
            expect(board).toHaveProperty('owner');
            expect(board.owner).toHaveProperty('id');
            expect(board).toHaveProperty('collaborators');
            expect(board.collaborators).toBeInstanceOf(Array);
          });
          resolve(boards);
        }
      });
  });
};

// add test for graphql mutation
/*
  CreateBoard($title: String!) {
    createBoard(title: $title) {
      message
      board {
        id
        title
        owner {
          id
          user_name
          email
          filename
        }
        collaborators {
          id
          user_name
          email
          filename
        }
      }
    }
  }
*/

const createBoard = (
  url: string | Application,
  title: string,
  token: string,
): Promise<BoardTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation CreateBoard($title: String!) {
          createBoard(title: $title) {
            message
            board {
              id
              title
              owner {
                id
                user_name
                email
                filename
              }
              collaborators {
                id
                user_name
                email
                filename
              }
            }
          }
        }`,
        variables: {
          title,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const board = response.body.data.createBoard.board;
          expect(board).toHaveProperty('id');
          expect(board).toHaveProperty('title');
          expect(board).toHaveProperty('owner');
          expect(board.owner).toHaveProperty('id');
          expect(board).toHaveProperty('collaborators');
          expect(board.collaborators).toBeInstanceOf(Array);
          resolve(board);
        }
      });
  });
};

// add test for graphql mutation
/*
  UpdateBoard($boardId: ID!, $title: String!) {
    updateBoard(id: $boardId, title: $title) {
      message
      board {
        id
        title
        owner {
          id
          user_name
          email
          filename
        }
        collaborators {
          id
          user_name
          email
          filename
        }
      }
    }
  }
*/

const updateBoard = (
  url: string | Application,
  id: string,
  title: string,
  token: string,
): Promise<BoardTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UpdateBoard($boardId: ID!, $title: String!) {
          updateBoard(id: $boardId, title: $title) {
            message
            board {
              id
              title
              owner {
                id
                user_name
                email
                filename
              }
              collaborators {
                id
                user_name
                email
                filename
              }
            }
          }
        }`,
        variables: {
          boardId: id,
          title,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const board = response.body.data.updateBoard.board;
          expect(board).toHaveProperty('id');
          expect(board).toHaveProperty('title');
          expect(board).toHaveProperty('owner');
          expect(board.owner).toHaveProperty('id');
          expect(board).toHaveProperty('collaborators');
          expect(board.collaborators).toBeInstanceOf(Array);
          resolve(board);
        }
      });
  });
};

// add test for graphql mutation
/*
  DeleteBoard($boardId: ID!) {
    deleteBoard(id: $boardId) {
      message
    }
  }
*/

const deleteBoard = (
  url: string | Application,
  id: string,
  token: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeleteBoard($boardId: ID!) {
          deleteBoard(id: $boardId)
        }`,
        variables: {
          boardId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message = response.body.data.deleteBoard.message;
          resolve(message);
        }
      });
  });
};

// add test for graphql mutation
/*
  ShareBoard($boardId: ID!, $userId: ID!) {
    shareBoardWithUser(board_id: $boardId, user_id: $userId) {
      message
      board {
        id
        title
        owner {
          id
          user_name
          email
          filename
        }
        collaborators {
          id
          user_name
          email
          filename
        }
      }
    }
  }
*/

const shareBoard = (
  url: string | Application,
  boardId: string,
  userId: string,
  token: string,
): Promise<BoardTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation ShareBoard($boardId: ID!, $userId: ID!) {
          shareBoardWithUser(board_id: $boardId, user_id: $userId) {
            message
            board {
              id
              title
              owner {
                id
                user_name
                email
                filename
              }
              collaborators {
                id
                user_name
                email
                filename
              }
            }
          }
        }`,
        variables: {
          boardId,
          userId,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const board = response.body.data.shareBoardWithUser.board;
          expect(board).toHaveProperty('id');
          expect(board).toHaveProperty('title');
          expect(board).toHaveProperty('owner');
          expect(board.owner).toHaveProperty('id');
          expect(board).toHaveProperty('collaborators');
          expect(board.collaborators).toBeInstanceOf(Array);
          resolve(board);
        }
      });
  });
};

// add test for graphql mutation
/*
  UnshareBoard($boardId: ID!, $userId: ID!) {
    unshareBoardWithUser(board_id: $boardId, user_id: $userId) {
      message
      board {
        id
        title
        owner {
          id
          user_name
          email
          filename
        }
        collaborators {
          id
          user_name
          email
          filename
        }
      }
    }
  }
*/

const unshareBoard = (
  url: string | Application,
  boardId: string,
  userId: string,
  token: string,
): Promise<BoardTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UnshareBoard($boardId: ID!, $userId: ID!) {
          unshareBoardWithUser(board_id: $boardId, user_id: $userId) {
            message
            board {
              id
              title
              owner {
                id
                user_name
                email
                filename
              }
              collaborators {
                id
                user_name
                email
                filename
              }
            }
          }
        }`,
        variables: {
          boardId,
          userId,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const board = response.body.data.unshareBoardWithUser.board;
          expect(board).toHaveProperty('id');
          expect(board).toHaveProperty('title');
          expect(board).toHaveProperty('owner');
          expect(board.owner).toHaveProperty('id');
          expect(board).toHaveProperty('collaborators');
          expect(board.collaborators).toBeInstanceOf(Array);
          resolve(board);
        }
      });
  });
};

export {
  getBoard,
  getOwnedBoards,
  getSharedBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  shareBoard,
  unshareBoard,
};
