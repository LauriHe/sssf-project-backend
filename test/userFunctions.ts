/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import randomstring from 'randomstring';
import {UserTest} from '../src/types/DBTypes';
import {Application} from 'express';
import {
  LoginMessage,
  UploadResponse,
  UserMessage,
} from '../src/types/MessageTypes';

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

const loginUser = (
  url: string | Application,
  vars: {credentials: {user_name: string; password: string}},
): Promise<LoginMessage> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Login($credentials: Credentials!) {
          login(credentials: $credentials) {
            token
            message
            user {
              id
              user_name
              email
              filename
            }
          }
        }`,
        variables: vars,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('login response', response.body);
          const userData = response.body.data.login;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('token');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          resolve(response.body.data.login);
        }
      });
  });
};

const postFile = (url: string | Application): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/upload')
      .attach('image', 'test/test.jpeg')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const uploadMessageResponse = response.body;
          expect(uploadMessageResponse).toHaveProperty('message');
          expect(uploadMessageResponse).toHaveProperty('filename');
          resolve(uploadMessageResponse);
        }
      });
  });
};

const postUser = (
  url: string | Application,
  user: UserTest,
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Mutation($user: UserInput!) {
          register(user: $user) {
            message
            user {
              id
              user_name
              email
              filename
            }
          }
        }`,
        variables: {
          user: {
            user_name: user.user_name,
            email: user.email,
            password: user.password,
            filename: user.filename,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.register;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.user_name).toBe(user.user_name);
          expect(userData.user.email).toBe(user.email);
          resolve(response.body.data.register);
        }
      });
  });
};

const putUser = (url: string | Application, token: string) => {
  return new Promise((resolve, reject) => {
    const newValue = 'Test Loser ' + randomstring.generate(7);
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation UpdateUser($user: UserModify!) {
          updateUser(user: $user) {
            message
            user {
              id
              user_name
              email
              filename
            }
          }
        }`,
        variables: {
          user: {
            user_name: newValue,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.updateUser;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.user_name).toBe(newValue);
          resolve(response.body.data.updateUser);
        }
      });
  });
};

const deleteUser = (
  url: string | Application,
  token: string,
): Promise<UserMessage> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteUser {
          deleteUser {
            message
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message = response.body.data.deleteUser;
          resolve(message);
        }
      });
  });
};

export {
  getUser,
  getSingleUser,
  getUserByName,
  loginUser,
  postFile,
  postUser,
  putUser,
  deleteUser,
};
