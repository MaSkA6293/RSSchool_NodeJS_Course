import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputObjectType,
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

export const userWithSubscribedToProfileType = new GraphQLObjectType({
  name: 'userWithSubscribedToProfile',
  description: 'Get all users with their ubscribedTo profile',
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
      type: new GraphQLList(profileType),
      description: 'profiles of subscribedToUsers',
      resolve: async (user, _source, contextValue) => {
        return user.subscribedToUserIds;
      },
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

export const userWithSubscribedToPostsType = new GraphQLObjectType({
  name: 'userWithSubscribedToPosts',
  description: 'Get all users with their ubscribedTo profile',
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
      type: new GraphQLList(postType),
      description: 'profiles of subscribedToUsers',
      resolve: async (user, _source, contextValue) => {
        return user.subscribedToUserIds;
      },
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

export const userCreateInputType = new GraphQLInputObjectType({
  name: 'userCreate',
  fields: {
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

export const userUpdateInputType = new GraphQLInputObjectType({
  name: 'userUpdate',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
  },
});
