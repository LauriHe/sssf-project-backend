import {GraphQLError} from 'graphql';
import {MyContext} from '../../types/MyContext';
import noteModel from '../models/noteModel';
import {Note} from '../../types/DBTypes';
import {NoteMessage} from '../../types/MessageTypes';

export default {
  Query: {
    noteById: async (
      _parent: undefined,
      args: {id: string},
      contextValue: MyContext,
    ): Promise<Note> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const note = await noteModel.findById(args.id);
      if (!note) throw new GraphQLError('Note not found');
      if (note.owner._id !== userId && !note.collaborators.includes(userId))
        throw new GraphQLError('Not authorized');
      return note;
    },
    ownedNotes: async (
      _parent: undefined,
      contextValue: MyContext,
    ): Promise<Note[]> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const notes = await noteModel
        .find({owner: userId})
        .populate('owner', '_id user_name email filename');
      return notes;
    },
    sharedNotes: async (
      _parent: undefined,
      contextValue: MyContext,
    ): Promise<Note[]> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const notes = await noteModel
        .find({collaborators: userId})
        .populate('owner', '_id user_name email filename');
      return notes;
    },
  },
  Mutation: {
    createNote: async (
      _parent: undefined,
      args: {title: string; content: string},
      contextValue: MyContext,
    ): Promise<NoteMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const input = {
        owner: userId,
        title: args.title,
        content: args.content,
      };
      const response = await (
        await noteModel.create(input)
      ).populate('owner', '_id user_name email filename');
      if (!response) throw new GraphQLError('Note not created');
      const note = {
        id: response._id,
        owner: response.owner,
        collaborators: [],
        title: response.title,
        content: response.content,
      };
      return {message: 'Note created', note: note};
    },
    updateNote: async (
      _parent: undefined,
      args: {id: string; title: string; content: string},
      contextValue: MyContext,
    ): Promise<NoteMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const noteInfo = await noteModel.findById(args.id);
      if (!noteInfo) throw new GraphQLError('Note not found');
      if (
        noteInfo.owner._id !== userId &&
        !noteInfo.collaborators.includes(userId)
      )
        throw new GraphQLError('Not authorized');
      const response = await noteModel.findByIdAndUpdate(
        args.id,
        {title: args.title, content: args.content},
        {new: true},
      );
      if (!response) throw new GraphQLError('Note not updated');
      const newNote = {
        id: response._id,
        owner: response.owner,
        collaborators: response.collaborators,
        title: response.title,
        content: response.content,
      };
      return {message: 'Note updated', note: newNote};
    },
    deleteNote: async (
      _parent: undefined,
      args: {id: string},
      contextValue: MyContext,
    ): Promise<string> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const noteInfo = await noteModel.findById(args.id);
      if (!noteInfo) throw new GraphQLError('Note not found');
      if (noteInfo.owner._id !== userId)
        throw new GraphQLError('Not authorized');
      const response = await noteModel.findByIdAndDelete(args.id);
      if (!response) throw new GraphQLError('Note not deleted');
      return 'Note deleted';
    },
    shareNoteWithUser: async (
      _parent: undefined,
      args: {note_id: string; user_id: string},
      contextValue: MyContext,
    ): Promise<NoteMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const noteInfo = await noteModel.findById(args.note_id);
      if (!noteInfo) throw new GraphQLError('Note not found');
      if (noteInfo.owner._id !== userId)
        throw new GraphQLError('Not authorized');
      const response = await noteModel.findByIdAndUpdate(
        args.note_id,
        {$push: {collaborators: args.user_id}},
        {new: true},
      );
      if (!response) throw new GraphQLError('Note not shared');
      const newNote = {
        id: response._id,
        owner: response.owner,
        collaborators: response.collaborators,
        title: response.title,
        content: response.content,
      };
      return {message: 'Note shared', note: newNote};
    },
    unshareNoteWithUser: async (
      _parent: undefined,
      args: {note_id: string; user_id: string},
      contextValue: MyContext,
    ): Promise<NoteMessage> => {
      if (!contextValue.userdata) throw new GraphQLError('Not authenticated');
      const userId = contextValue.userdata.user.id;
      const noteInfo = await noteModel.findById(args.note_id);
      if (!noteInfo) throw new GraphQLError('Note not found');
      if (noteInfo.owner._id !== userId)
        throw new GraphQLError('Not authorized');
      const response = await noteModel.findByIdAndUpdate(
        args.note_id,
        {$pull: {collaborators: args.user_id}},
        {new: true},
      );
      if (!response) throw new GraphQLError('Note not unshared');
      const newNote = {
        id: response._id,
        owner: response.owner,
        collaborators: response.collaborators,
        title: response.title,
        content: response.content,
      };
      return {message: 'Note unshared', note: newNote};
    },
  },
};
