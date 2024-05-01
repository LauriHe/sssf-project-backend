import {GraphQLError} from 'graphql';
import {List} from '../../types/DBTypes';
import listModel from '../models/listModel';
import {MyContext} from '../../types/MyContext';
import {ListMessage} from '../../types/MessageTypes';
import boardModel from '../models/boardModel';

export default {
  Query: {
    listById: async (
      _parent: undefined,
      args: {id: string},
      contextValue: MyContext,
    ): Promise<List> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const list = await listModel
        .findById(args.id)
        .populate('board', '_id title');
      if (!list) throw new GraphQLError('List not found');
      const boardInfo = await boardModel
        .findById(list.board)
        .populate('owner collaborators', '_id user_name email filename');
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        String(boardInfo.owner._id) !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      return list;
    },
    listsByBoard: async (
      _parent: undefined,
      args: {board_id: string},
      contextValue: MyContext,
    ): Promise<List[]> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const boardInfo = await boardModel
        .findById(args.board_id)
        .populate('owner collaborators', '_id user_name email filename');
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        String(boardInfo.owner._id) !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const lists = await listModel
        .find({board: args.board_id})
        .populate('board', '_id title');
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
      const boardInfo = await boardModel
        .findById(args.board_id)
        .populate('owner collaborators', '_id user_name email filename');
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        String(boardInfo.owner._id) !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const input = {
        board: args.board_id,
        title: args.title,
      };
      const response = await (
        await listModel.create(input)
      ).populate('board', '_id title');
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
      const boardInfo = await boardModel
        .findById(listInfo.board)
        .populate('owner collaborators', '_id user_name email filename');
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        String(boardInfo.owner._id) !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const response = await listModel
        .findByIdAndUpdate(args.id, {title: args.title}, {new: true})
        .populate('board', '_id title');
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
      const boardInfo = await boardModel
        .findById(listInfo.board)
        .populate('owner collaborators', '_id user_name email filename');
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        String(boardInfo.owner._id) !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const response = await listModel.findByIdAndDelete(args.id);
      if (!response) throw new GraphQLError('List not deleted');
      return 'List deleted';
    },
  },
};
