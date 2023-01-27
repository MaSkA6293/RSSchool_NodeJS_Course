import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInt,
} from 'graphql';

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  description: 'Profile entity',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the profile.',
    },
    avatar: {
      type: GraphQLString,
      description: 'The avatar name of the profile.',
    },
    sex: {
      type: GraphQLString,
      description: 'The sex of the profile.',
    },
    birthday: {
      type: GraphQLInt,
      description: 'The birthday of the of the user.',
    },
    country: {
      type: GraphQLString,
      description: 'The country of the user.',
    },
    street: {
      type: GraphQLString,
      description: 'The street of the user.',
    },
    city: {
      type: GraphQLString,
      description: 'The city of the user.',
    },
    memberTypeId: {
      type: GraphQLString,
      description: 'The id of the member-type.',
    },
    userId: {
      type: GraphQLString,
      description: 'The id of the user.',
    },
  }),
});
