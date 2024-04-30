/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import {Application} from 'express';
import {ListTest} from '../src/types/DBTypes';

// add test for graphql query
/*
  query ListById($id: ID!) {
    listById(id: $id) {
      id
      board
      title
    }
  }
 */

const getSingleList = async (
  url: string | Application,
  id: string,
  token: string,
): Promise<ListTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query ListById($listId: ID!) {
          listById(id: $listId) {
            id
            board
            title
          }
        }`,
        variables: {
          listId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const list = response.body.data.listById;
          expect(list.id).toBe(id);
          expect(list).toHaveProperty('board');
          expect(list).toHaveProperty('title');
          resolve(list);
        }
      });
  });
};

// add test for graphql query

/*
  query ListsByBoard($boardId: ID!) {
    listsByBoard(board_id: $boardId) {
      id
      board
      title
    }
  }
 */

const getListsByBoard = async (
  url: string | Application,
  id: string,
  token: string,
): Promise<ListTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query ListsByBoard($boardId: ID!) {
          listsByBoard(board_id: $boardId) {
            id
            board
            title
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
          const lists = response.body.data.listsByBoard;
          lists.forEach((list: ListTest) => {
            expect(list).toHaveProperty('id');
            expect(list).toHaveProperty('board');
            expect(list.board).toBe(id);
            expect(list).toHaveProperty('title');
          });
          resolve(lists);
        }
      });
  });
};

// add test for graphql mutation

/*
  mutation CreateList($boardId: ID!, $title: String!) {
    createList(board_id: $boardId, title: $title) {
      message
      list {
        id
        board
        title
      }
    }
  }
 */

const createList = async (
  url: string | Application,
  boardId: string,
  title: string,
  token: string,
): Promise<ListTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation CreateList($boardId: ID!, $title: String!) {
          createList(board_id: $boardId, title: $title) {
            message
            list {
              id
              board
              title
            }
          }
        }`,
        variables: {
          boardId: boardId,
          title: title,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const list = response.body.data.createList.list;
          expect(list).toHaveProperty('id');
          expect(list.board).toBe(boardId);
          expect(list.title).toBe(title);
          resolve(list);
        }
      });
  });
};

// add test for graphql mutation

/*
  mutation UpdateList($id: ID!, $title: String!) {
    updateList(id: $id, title: $title) {
      message
      list {
        id
        board
        title
      }
    }
  }
 */

const updateList = async (
  url: string | Application,
  id: string,
  title: string,
  token: string,
): Promise<ListTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UpdateList($id: ID!, $title: String!) {
          updateList(id: $id, title: $title) {
            message
            list {
              id
              board
              title
            }
          }
        }`,
        variables: {
          id: id,
          title: title,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const list = response.body.data.updateList.list;
          expect(list.id).toBe(id);
          expect(list).toHaveProperty('board');
          expect(list).toHaveProperty('title');
          expect(list.title).toBe(title);
          resolve(list);
        }
      });
  });
};

// add test for graphql mutation

/*
  mutation DeleteList($id: ID!) {
    deleteList(id: $id) {
      message
    }
  }
 */

const deleteList = async (
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
        query: `mutation DeleteList($id: ID!) {
          deleteList(id: $id) {
            message
          }
        }`,
        variables: {
          id: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message = response.body.data.deleteList.message;
          resolve(message);
        }
      });
  });
};

export {getSingleList, getListsByBoard, createList, updateList, deleteList};
