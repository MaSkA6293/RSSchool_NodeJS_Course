import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  description: 'MemberType entity',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the member type.',
    },
    discount: {
      type: GraphQLInt,
    },
    monthPostsLimit: {
      type: GraphQLInt,
    },
  }),
});

export const memberTypeUpdateInputType = new GraphQLInputObjectType({
  name: 'memberTypeUpdate',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});
