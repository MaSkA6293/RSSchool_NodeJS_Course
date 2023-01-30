import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';

export const postType = new GraphQLObjectType({
  name: 'Post',
  description: 'Post entity',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the post.',
    },
    title: {
      type: GraphQLString,
      description: 'The title name of the post.',
    },
    content: {
      type: GraphQLString,
      description: 'The content of the post.',
    },
    userId: {
      type: GraphQLString,
      description: 'The id of the of the user.',
    },
  }),
});

export const postCreateInputType = new GraphQLInputObjectType({
  name: 'prostCreate',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const postUpdateInputType = new GraphQLInputObjectType({
  name: 'postUpdate',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});
