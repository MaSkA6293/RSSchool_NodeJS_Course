import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';
import { memberType } from '../member-type/type';

import { postType } from '../post/type';
import { profileType } from '../profile/type';
import {
  userGetUsersPosts,
  userGetUsersProfiles,
  userGetUsersMemberTypes,
} from './resolver';

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
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
      description: 'subscribed',
    },
    posts: {
      type: new GraphQLList(postType),
      description: 'users posts',
      resolve: async (user, _source, contextValue) => {
        return await userGetUsersPosts(user, contextValue);
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
      description: 'users profiles',
      resolve: async (user, _source, contextValue) => {
        return await userGetUsersProfiles(user, contextValue);
      },
    },
    memberTypes: {
      type: new GraphQLList(memberType),
      description: 'users memberTypes',
      resolve: async (user, _source, contextValue) => {
        return await userGetUsersMemberTypes(user, contextValue);
      },
    },
  }),
});