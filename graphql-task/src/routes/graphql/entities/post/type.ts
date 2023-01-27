import { GraphQLString, GraphQLNonNull, GraphQLObjectType } from 'graphql';

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
