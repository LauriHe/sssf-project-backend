import {GraphQLError} from 'graphql';
import {UserInput, UserOutput} from '../../types/DBTypes';
import userModel from '../models/userModel';
import fetchData from '../../functions/fetchData';
import {LoginMessage, UserMessage} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';

export default {
  Query: {
    users: async (): Promise<UserOutput[]> => {
      return userModel.find().select('-password');
    },
    userById: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<UserOutput> => {
      const user = await userModel.findById(args.id).select('-password');
      if (!user) throw new GraphQLError('User not found');
      return user;
    },
    userByName: async (
      _parent: undefined,
      args: {user_name: string},
    ): Promise<UserOutput> => {
      const user = await userModel
        .findOne({user_name: args.user_name})
        .select('-password');
      if (!user) throw new GraphQLError('User not found');
      return user;
    },
    checkToken: async (
      _parent: undefined,
      args: {token: string},
    ): Promise<UserMessage> => {
      const url = process.env.AUTH_URL + '/api/v1/users/token';
      const options = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + args.token,
        },
      };
      const response: UserOutput = await fetchData(url, options);
      return {message: 'Token is valid', user: response};
    },
  },
  Mutation: {
    login: async (
      _parent: undefined,
      args: {credentials: {user_name: string; password: string}},
    ): Promise<LoginMessage> => {
      const url = process.env.AUTH_URL + 'auth/login';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: args.credentials.user_name,
          password: args.credentials.password,
        }),
      };
      const response: LoginMessage = await fetchData(url, options);
      return response;
    },
    register: async (
      _parent: undefined,
      args: {user: UserInput},
    ): Promise<UserMessage> => {
      const username = await userModel.findOne({
        user_name: args.user.user_name,
      });
      if (username) throw new GraphQLError('Username already exists');
      const url = process.env.AUTH_URL + 'users/';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.user),
      };
      const response: UserMessage = await fetchData(url, options);
      return response;
    },
    updateUser: async (
      _parent: undefined,
      args: {user: UserInput},
      contextValue: MyContext,
    ): Promise<UserMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const id = contextValue.userdata.user.id;
      const response = await userModel.findByIdAndUpdate(
        id,
        {
          user_name: args.user.user_name,
          email: args.user.email,
          password: args.user.password,
          filename: args.user.filename,
        },
        {
          new: true,
        },
      );
      if (!response) throw new GraphQLError('User not found');
      const user: UserOutput = {
        email: response.email,
        id: response._id,
        user_name: response.user_name,
        filename: response.filename,
      };
      return {message: 'User updated', user};
    },
    deleteUser: async (
      _parent: undefined,
      args: {},
      contextValue: MyContext,
    ): Promise<string> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const id = contextValue.userdata.user.id;
      const response = await userModel.findByIdAndDelete(id);
      if (!response) throw new GraphQLError('User not found');
      return 'User deleted';
    },
  },
};
