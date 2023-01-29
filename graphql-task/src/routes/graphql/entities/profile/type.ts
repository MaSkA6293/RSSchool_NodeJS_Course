import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLInputObjectType,
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

export const profileCreateInputType = new GraphQLInputObjectType({
  name: 'profileCreate',
  fields: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
