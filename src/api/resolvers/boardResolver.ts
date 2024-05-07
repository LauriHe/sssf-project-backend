import {GraphQLError} from 'graphql';
import {Board} from '../../types/DBTypes';
import boardModel from '../models/boardModel';
import {MyContext} from '../../types/MyContext';
import {BoardMessage} from '../../types/MessageTypes';

export default {
  Query: {
    boardById: async (
      _parent: undefined,
      args: {id: string},
      contextValue: MyContext,
    ): Promise<Board> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const board = await boardModel
        .findById(args.id)
        .populate('owner collaborators', '_id user_name email filename');
      if (!board) throw new GraphQLError('Board not found');
      const isCollaborator = board.collaborators.some((collaborator) => {
        return String(collaborator._id) === userId;
      });
      if (String(board.owner._id) !== userId && !isCollaborator)
        throw new GraphQLError('Not authorized');
      return board;
    },
    ownedBoards: async (
      _parent: undefined,
      _args: undefined,
      contextValue: MyContext,
    ): Promise<Board[]> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const id = contextValue.userdata.user.id;
      const boards = await boardModel
        .find({owner: id})
        .populate('owner collaborators', '_id user_name email filename');
      return boards;
    },
    sharedBoards: async (
      _parent: undefined,
      _args: undefined,
      contextValue: MyContext,
    ): Promise<Board[]> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const id = contextValue.userdata.user.id;
      const boards = await boardModel
        .find({collaborators: id})
        .populate('owner collaborators', '_id user_name email filename');
      return boards;
    },
  },
  Mutation: {
    createBoard: async (
      _parent: undefined,
      args: {title: string},
      contextValue: MyContext,
    ): Promise<BoardMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const input = {
        owner: userId,
        title: args.title,
      };
      const response = await (
        await boardModel.create(input)
      ).populate('owner collaborators', '_id user_name email filename');
      if (!response) throw new GraphQLError('Board not created');
      const board = {
        id: response._id,
        owner: response.owner,
        collaborators: [],
        title: response.title,
      };
      return {message: 'Board created', board};
    },
    updateBoard: async (
      _parent: undefined,
      args: {id: string; title: string},
      contextValue: MyContext,
    ): Promise<BoardMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const boardInfo = await boardModel.findById(args.id);
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        String(boardInfo.owner._id) !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const response = await boardModel
        .findByIdAndUpdate(args.id, {title: args.title}, {new: true})
        .populate('owner collaborators', '_id user_name email filename');
      if (!response) throw new GraphQLError('Board not updated');
      const newBoard = {
        id: response._id,
        owner: response.owner,
        collaborators: [],
        title: response.title,
      };
      return {message: 'Board updated', board: newBoard};
    },
    deleteBoard: async (
      _parent: undefined,
      args: {id: string},
      contextValue: MyContext,
    ): Promise<string> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const boardInfo = await boardModel.findById(args.id);
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (String(boardInfo.owner._id) !== userId)
        throw new GraphQLError('Not authorized');
      const response = await boardModel.findByIdAndDelete(args.id);
      if (!response) throw new GraphQLError('Board not deleted');
      return 'Board deleted';
    },
    shareBoardWithUser: async (
      _parent: undefined,
      args: {board_id: string; user_id: string},
      contextValue: MyContext,
    ): Promise<BoardMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const boardInfo = await boardModel.findById(args.board_id);
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (String(boardInfo.owner._id) !== userId)
        throw new GraphQLError('Not authorized');
      const response = await boardModel
        .findByIdAndUpdate(
          args.board_id,
          {$push: {collaborators: args.user_id}},
          {new: true},
        )
        .populate('owner collaborators', '_id user_name email filename');
      if (!response) throw new GraphQLError('Board not shared');
      const board = {
        id: response._id,
        owner: response.owner,
        collaborators: response.collaborators,
        title: response.title,
      };
      return {message: 'Board shared', board};
    },
    unshareBoardWithUser: async (
      _parent: undefined,
      args: {board_id: string; user_id: string},
      contextValue: MyContext,
    ): Promise<BoardMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const boardInfo = await boardModel.findById(args.board_id);
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (String(boardInfo.owner._id) !== userId)
        throw new GraphQLError('Not authorized');
      const response = await boardModel
        .findByIdAndUpdate(
          args.board_id,
          {$pull: {collaborators: args.user_id}},
          {new: true},
        )
        .populate('owner collaborators', '_id user_name email filename');
      if (!response) throw new GraphQLError('Board not unshared');
      const board = {
        id: response._id,
        owner: response.owner,
        collaborators: response.collaborators,
        title: response.title,
      };
      return {message: 'Board unshared', board};
    },
  },
};
