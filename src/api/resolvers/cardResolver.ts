import {GraphQLError} from 'graphql';
import {Card} from '../../types/DBTypes';
import cardModel from '../models/cardModel';
import {MyContext} from '../../types/MyContext';
import boardModel from '../models/boardModel';
import listModel from '../models/listModel';
import {CardMessage} from '../../types/MessageTypes';

export default {
  Query: {
    cardById: async (
      _parent: undefined,
      args: {id: string},
      contextValue: MyContext,
    ): Promise<Card> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const card = await cardModel.findById(args.id).populate('list');
      if (!card) throw new GraphQLError('Card not found');
      const list = await listModel
        .findById(card.list._id)
        .populate('board', '_id title');
      if (!list) throw new GraphQLError('List not found');
      const boardInfo = await boardModel
        .findById(list.board._id)
        .populate('owner collaborators', '_id user_name email filename');
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        String(boardInfo.owner._id) !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      return card;
    },
    cardsByList: async (
      _parent: undefined,
      args: {list_id: string},
      contextValue: MyContext,
    ): Promise<Card[]> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const listInfo = await listModel
        .findById(args.list_id)
        .populate('board', '_id title');
      if (!listInfo) throw new GraphQLError('List not found');
      const boardInfo = await boardModel
        .findById(listInfo.board._id)
        .populate('owner collaborators', '_id user_name email filename');
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        String(boardInfo.owner._id) !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const cards = await cardModel.find({list: args.list_id}).populate('list');
      if (!cards) throw new GraphQLError('Card not found');
      return cards;
    },
  },
  Mutation: {
    createCard: async (
      _parent: undefined,
      args: {list_id: string; title: string; content: string},
      contextValue: MyContext,
    ): Promise<CardMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const listInfo = await listModel
        .findById(args.list_id)
        .populate('board', '_id title');
      if (!listInfo) throw new GraphQLError('List not found');
      const boardInfo = await boardModel
        .findById(listInfo.board._id)
        .populate('owner collaborators', '_id user_name email filename');
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        String(boardInfo.owner._id) !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const input = {
        list: args.list_id,
        title: args.title,
        content: args.content,
      };
      const response = await (await cardModel.create(input)).populate('list');
      if (!response) throw new GraphQLError('Card not created');
      return {message: 'Card created', card: response};
    },
    updateCard: async (
      _parent: undefined,
      args: {id: string; title: string; content: string},
      contextValue: MyContext,
    ): Promise<CardMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const cardInfo = await cardModel.findById(args.id).populate('list');
      if (!cardInfo) throw new GraphQLError('Card not found');
      const listInfo = await listModel
        .findById(cardInfo.list.id)
        .populate('board', '_id title');
      if (!listInfo) throw new GraphQLError('List not found');
      const boardInfo = await boardModel
        .findById(listInfo.board._id)
        .populate('owner collaborators', '_id user_name email filename');
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        String(boardInfo.owner._id) !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const response = await cardModel
        .findByIdAndUpdate(
          args.id,
          {title: args.title, content: args.content},
          {new: true},
        )
        .populate('list');
      if (!response) throw new GraphQLError('Card not updated');
      return {message: 'Card updated', card: response};
    },
    deleteCard: async (
      _parent: undefined,
      args: {id: string},
      contextValue: MyContext,
    ): Promise<string> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const cardInfo = await cardModel.findById(args.id).populate('list');
      if (!cardInfo) throw new GraphQLError('Card not found');
      const listInfo = await listModel
        .findById(cardInfo.list.id)
        .populate('board', '_id title');
      if (!listInfo) throw new GraphQLError('List not found');
      const boardInfo = await boardModel
        .findById(listInfo.board._id)
        .populate('owner collaborators', '_id user_name email filename');
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        String(boardInfo.owner._id) !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const response = await cardModel.findByIdAndDelete(args.id);
      if (!response) throw new GraphQLError('Card not deleted');
      return 'Card deleted';
    },
  },
};
