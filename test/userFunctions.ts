import request from 'supertest';
import randomstring from 'randomstring';
import {UserTest} from '../src/types/DBTypes';
import {Application} from 'express';
import {LoginResponse, UserResponse} from '../src/types/MessageTypes';

const getUser = (url: string | Application): Promise<UserTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: '{users{id user_name email filename}}',
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users = response.body.data.users;
          expect(users).toBeInstanceOf(Array);
          expect(users[0]).toHaveProperty('id');
          expect(users[0]).toHaveProperty('user_name');
          expect(users[0]).toHaveProperty('email');
          resolve(response.body.data.users);
        }
      });
  });
};

const getSingleUser = (
  url: string | Application,
  id: string,
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query UserById($userByIdId: ID!) {
          userById(id: $userByIdId) {
            id
            user_name
            email
            filename
          }
        }`,
        variables: {
          userByIdId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body.data.userById;
          expect(user.id).toBe(id);
          expect(user).toHaveProperty('user_name');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('filename');
          resolve(response.body.data.userById);
        }
      });
  });
};

/* test for graphql query
query UserByName($name: String!) {
  userByName(user_name: $name) {
    id
    user_name
    email
    filename
  }
}
*/

const getUserByName = (
  url: string | Application,
  name: string,
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query UserByName($name: String!) {
          userByName(user_name: $name) {
            id
            user_name
            email
            filename
          }
        }`,
        variables: {
          name: name,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body.data.userByName;
          expect(user.user_name).toBe(name);
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('filename');
          resolve(response.body.data.userByName);
        }
      });
  });
};
