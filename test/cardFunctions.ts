/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import {Application} from 'express';
import {CardTest} from '../src/types/DBTypes';

// add test for graphql query
/*
  query CardById($id: ID!) {
    cardById(id: $id) {
      id
      list
      title
      content
    }
  }
 */

const getSingleCard = async (
  url: string | Application,
  id: string,
  token: string,
): Promise<CardTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query CardById($cardId: ID!) {
          cardById(id: $cardId) {
            id
            list {
              id
              title
            }
            title
            content
          }
        }`,
        variables: {
          cardId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const card = response.body.data.cardById;
          expect(card.id).toBe(id);
          expect(card).toHaveProperty('list');
          expect(card).toHaveProperty('title');
          expect(card).toHaveProperty('content');
          resolve(card);
        }
      });
  });
};

// add test for graphql query

/*
  query CardsByList($listId: ID!) {
    cardsByList(list_id: $listId) {
      id
      list
      title
      content
    }
  }
 */

const getCardsByList = async (
  url: string | Application,
  id: string,
  token: string,
): Promise<CardTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query CardsByList($listId: ID!) {
          cardsByList(list_id: $listId) {
            id
            list {
              id
              title
            }
            title
            content
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
          const cards = response.body.data.cardsByList;
          cards.forEach((card: CardTest) => {
            expect(card).toHaveProperty('id');
            expect(card).toHaveProperty('list');
            expect(card.list?.id).toBe(id);
            expect(card).toHaveProperty('title');
            expect(card).toHaveProperty('content');
          });
          resolve(cards);
        }
      });
  });
};

// add test for graphql mutation
/*
  mutation CreateCard($listId: ID!, $title: String!, $content: String) {
    createCard(list_id: $listId, title: $title, content: $content) {
      message
      card {
        id
        list
        title
        content
      }
    }
  }
 */

const createCard = async (
  url: string | Application,
  listId: string,
  title: string,
  content: string,
  token: string,
): Promise<CardTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation CreateCard($listId: ID!, $title: String!, $content: String) {
          createCard(list_id: $listId, title: $title, content: $content) {
            message
            card {
              id
              list {
                id
                title
              }
              title
              content
            }
          }
        }`,
        variables: {
          listId: listId,
          title: title,
          content: content,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const card = response.body.data.createCard.card;
          expect(card).toHaveProperty('id');
          expect(card.list.id).toBe(listId);
          expect(card.title).toBe(title);
          expect(card.content).toBe(content);
          resolve(card);
        }
      });
  });
};

// add test for graphql mutation
/*
  mutation UpdateCard($id: ID!, $title: String, $content: String) {
    updateCard(id: $id, title: $title, content: $content) {
      message
      card {
        id
        list
        title
        content
      }
    }
  }
 */

const updateCard = async (
  url: string | Application,
  id: string,
  title: string,
  content: string,
  token: string,
): Promise<CardTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UpdateCard($id: ID!, $title: String, $content: String) {
          updateCard(id: $id, title: $title, content: $content) {
            message
            card {
              id
              list {
                id
                title
              }
              title
              content
            }
          }
        }`,
        variables: {
          id: id,
          title: title,
          content: content,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const card = response.body.data.updateCard.card;
          expect(card.id).toBe(id);
          expect(card).toHaveProperty('list');
          expect(card.title).toBe(title);
          expect(card.content).toBe(content);
          resolve(card);
        }
      });
  });
};

// add test for graphql mutation
/*
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id) {
      message
    }
  }
 */

const deleteCard = async (
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
        query: `mutation DeleteCard($id: ID!) {
          deleteCard(id: $id)
        }`,
        variables: {
          id: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message = response.body.data.deleteCard.message;
          resolve(message);
        }
      });
  });
};

export {getSingleCard, getCardsByList, createCard, updateCard, deleteCard};
