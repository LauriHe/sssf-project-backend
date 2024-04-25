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
      const listInfo = await listModel.findById(args.id);
      if (!listInfo) throw new GraphQLError('List not found');
      const boardInfo = await boardModel.findById(listInfo.board);
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        boardInfo.owner._id !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const card = await cardModel.findById(args.id);
      if (!card) throw new GraphQLError('Card not found');
      return card;
    },
    cardsByList: async (
      _parent: undefined,
      args: {list_id: string},
      contextValue: MyContext,
    ): Promise<Card[]> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const listInfo = await listModel.findById(args.list_id);
      if (!listInfo) throw new GraphQLError('List not found');
      const boardInfo = await boardModel.findById(listInfo.board);
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        boardInfo.owner._id !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const cards = await cardModel.find({list: args.list_id});
      if (!cards) throw new GraphQLError('Card not found');
      return cards;
    },
  },
  Mutation: {
    createCard: async (
      _parent: undefined,
      args: {list_id: string; title: string},
      contextValue: MyContext,
    ): Promise<CardMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const listInfo = await listModel.findById(args.list_id);
      if (!listInfo) throw new GraphQLError('List not found');
      const boardInfo = await boardModel.findById(listInfo.board);
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        boardInfo.owner._id !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const input = {
        list: args.list_id,
        title: args.title,
      };
      const response = await cardModel.create(input);
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
      const cardInfo = await cardModel.findById(args.id);
      if (!cardInfo) throw new GraphQLError('Card not found');
      const listInfo = await listModel.findById(cardInfo.list);
      if (!listInfo) throw new GraphQLError('List not found');
      const boardInfo = await boardModel.findById(listInfo.board);
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        boardInfo.owner._id !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const response = await cardModel.findByIdAndUpdate(
        args.id,
        {title: args.title, content: args.content},
        {new: true},
      );
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
      const cardInfo = await cardModel.findById(args.id);
      if (!cardInfo) throw new GraphQLError('Card not found');
      const listInfo = await listModel.findById(cardInfo.list);
      if (!listInfo) throw new GraphQLError('List not found');
      const boardInfo = await boardModel.findById(listInfo.board);
      if (!boardInfo) throw new GraphQLError('Board not found');
      if (
        boardInfo.owner._id !== userId &&
        !boardInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const response = await cardModel.findByIdAndDelete(args.id);
      if (!response) throw new GraphQLError('Card not deleted');
      return 'Card deleted';
    },
  },
};
