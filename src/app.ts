/* eslint-disable node/no-extraneous-import */
require('dotenv').config();
import express from 'express';
import api from './api';
import helmet from 'helmet';
import cors from 'cors';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import typeDefs from './api/schemas/index';
import resolvers from './api/resolvers/index';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import {notFound, errorHandler} from './middlewares';
import authenticate from './functions/authenticate';
import {createRateLimitRule} from 'graphql-rate-limit';
import {shield} from 'graphql-shield';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {applyMiddleware} from 'graphql-middleware';
import {MyContext} from './types/MyContext';

const app = express();

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  }),
);

(async () => {
  try {
    // TODO Create a rate limit rule instance (not WSK2 course)
    const rateLimitRule = createRateLimitRule({
      identifyContext: (ctx) => ctx.id,
    });

    // TODO Create a permissions object (not WSK2 course)
    const permissions = shield({
      Query: {
        users: rateLimitRule({max: 20, window: '1m'}),
        userById: rateLimitRule({max: 20, window: '1m'}),
        userByName: rateLimitRule({max: 20, window: '1m'}),
        checkToken: rateLimitRule({max: 20, window: '1m'}),
        noteById: rateLimitRule({max: 500, window: '1m'}),
        ownedNotes: rateLimitRule({max: 500, window: '1m'}),
        sharedNotes: rateLimitRule({max: 500, window: '1m'}),
        boardById: rateLimitRule({max: 500, window: '1m'}),
        ownedBoards: rateLimitRule({max: 500, window: '1m'}),
        sharedBoards: rateLimitRule({max: 500, window: '1m'}),
        listById: rateLimitRule({max: 500, window: '1m'}),
        listsByBoard: rateLimitRule({max: 500, window: '1m'}),
        cardById: rateLimitRule({max: 500, window: '1m'}),
        cardsByList: rateLimitRule({max: 500, window: '1m'}),
      },
      Mutation: {
        login: rateLimitRule({max: 5, window: '10m'}),
        register: rateLimitRule({max: 5, window: '1m'}),
        updateUser: rateLimitRule({max: 10, window: '1m'}),
        deleteUser: rateLimitRule({max: 10, window: '1m'}),
        createNote: rateLimitRule({max: 20, window: '1m'}),
        updateNote: rateLimitRule({max: 20, window: '1m'}),
        deleteNote: rateLimitRule({max: 100, window: '1m'}),
        shareNoteWithUser: rateLimitRule({max: 50, window: '1m'}),
        unshareNoteWithUser: rateLimitRule({max: 50, window: '1m'}),
        createBoard: rateLimitRule({max: 20, window: '1m'}),
        updateBoard: rateLimitRule({max: 20, window: '1m'}),
        deleteBoard: rateLimitRule({max: 50, window: '1m'}),
        shareBoardWithUser: rateLimitRule({max: 50, window: '1m'}),
        unshareBoardWithUser: rateLimitRule({max: 50, window: '1m'}),
        createList: rateLimitRule({max: 20, window: '1m'}),
        updateList: rateLimitRule({max: 20, window: '1m'}),
        deleteList: rateLimitRule({max: 100, window: '1m'}),
        createCard: rateLimitRule({max: 20, window: '1m'}),
        updateCard: rateLimitRule({max: 20, window: '1m'}),
        deleteCard: rateLimitRule({max: 100, window: '1m'}),
      },
    });

    const schema = applyMiddleware(
      makeExecutableSchema({
        typeDefs,
        resolvers,
      }),
      permissions,
    );

    const server = new ApolloServer<MyContext>({
      schema,
      introspection: true,
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({
              embed: true as false,
            })
          : ApolloServerPluginLandingPageLocalDefault(),
      ],
      includeStacktraceInErrorResponses: false,
    });
    await server.start();

    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(server, {
        context: async ({req}) => authenticate(req),
      }),
    );

    app.use(cors());
    app.use('/api', express.json(), api);
    app.use('/uploads', express.static('uploads'));
    app.use(notFound);
    app.use(errorHandler);
  } catch (error) {
    console.log(error);
  }
})();

export default app;
