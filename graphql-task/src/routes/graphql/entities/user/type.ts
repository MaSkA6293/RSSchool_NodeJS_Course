import { GraphQLString, GraphQLNonNull, GraphQLObjectType } from 'graphql';

export const userType = new GraphQLObjectType({
  name: 'User',
  description: 'User entity',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the user.',
    },
    firstName: {
      type: GraphQLString,
      description: 'The first name of the user.',
    },
    lastName: {
      type: GraphQLString,
      description: 'The lastName name of the user.',
    },
    email: {
      type: GraphQLString,
      description: 'The email name of the user.',
    },
  }),
});
