import {GraphQLError} from 'graphql';
import {List} from '../../types/DBTypes';
import listModel from '../models/listModel';
import {MyContext} from '../../types/MyContext';
import {ListMessage} from '../../types/MessageTypes';
import boardModel from '../models/boardModel';

export default {
  Query: {
    listById: async (_parent: undefined, args: {id: string}): Promise<List> => {
      const list = await listModel.findById(args.id);
      if (!list) throw new GraphQLError('List not found');
      return list;
    },
    listsByBoard: async (
      _parent: undefined,
      args: {board_id: string},
    ): Promise<List[]> => {
      const lists = await listModel.find({board: args.board_id});
      if (!lists) throw new GraphQLError('List not found');
      return lists;
    },
  },
  Mutation: {
    createList: async (
      _parent: undefined,
      args: {board_id: string; title: string},
      contextValue: MyContext,
    ): Promise<ListMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const boardInfo = await boardModel.findById(args.board_id);
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        boardInfo.owner._id !== userId ||
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const input = {
        board: args.board_id,
        title: args.title,
      };
      const response = await listModel.create(input);
      if (!response) throw new GraphQLError('List not created');
      const newList = {
        id: response._id,
        board: response.board,
        title: response.title,
      };
      return {message: 'List created', list: newList};
    },
    updateList: async (
      _parent: undefined,
      args: {id: string; title: string},
      contextValue: MyContext,
    ): Promise<ListMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const listInfo = await listModel.findById(args.id);
      if (!listInfo) throw new GraphQLError('List not found');
      const boardInfo = await boardModel.findById(listInfo.board);
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        boardInfo.owner._id !== userId ||
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const response = await listModel.findByIdAndUpdate(
        args.id,
        {title: args.title},
        {new: true},
      );
      if (!response) throw new GraphQLError('List not updated');
      const updatedList = {
        id: response._id,
        board: response.board,
        title: response.title,
      };
      return {message: 'List updated', list: updatedList};
    },
    deleteList: async (
      _parent: undefined,
      args: {id: string},
      contextValue: MyContext,
    ): Promise<string> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const listInfo = await listModel.findById(args.id);
      if (!listInfo) throw new GraphQLError('List not found');
      const boardInfo = await boardModel.findById(listInfo.board);
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        boardInfo.owner._id !== userId ||
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const response = await listModel.findByIdAndDelete(args.id);
      if (!response) throw new GraphQLError('List not deleted');
      return 'List deleted';
    },
  },
};
