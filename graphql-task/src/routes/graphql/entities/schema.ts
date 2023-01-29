import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

import {
  userType,
  userWithSubscribedToProfileType,
  userWithSubscribedToPostsType,
} from './user/type';
import { postType } from './post/type';
import { profileType } from './profile/type';
import { memberType } from './member-type/type';

import {
  userGetAll,
  userGetById,
  getAllSubscribedProfiles,
  getAllSubscribedPosts,
  userCreate,
} from './user/resolver';
import { profileCreate } from './profile/resolver';
import { postGetAll, postGetById } from './post/resolver';
import { profileGetAll, getProfileById } from './profile/resolver';
import { memberTypeGetAll, memberTypeGetById } from './member-type/resolver';

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    getUsers: {
      type: new GraphQLList(userType),
      resolve: async (_source, args, contextValue) => {
        return await userGetAll(contextValue);
      },
    },
    getUserById: {
      type: userType,
      args: {
        id: {
          description: 'user id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_source, args, contextValue) => {
        return await userGetById(args, contextValue);
      },
    },
    getPosts: {
      type: new GraphQLList(postType),
      resolve: async (_source, __, contextValue) => {
        return await postGetAll(contextValue);
      },
    },
    getPostById: {
      type: postType,
      args: {
        id: {
          description: 'post id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_source, args, contextValue) => {
        return await postGetById(args, contextValue);
      },
    },
    getProfiles: {
      type: new GraphQLList(profileType),
      resolve: async (_source, __, contextValue) => {
        return await profileGetAll(contextValue);
      },
    },
    getProfileById: {
      type: profileType,
      args: {
        id: {
          description: 'profile id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_source, args, contextValue) => {
        return await getProfileById(args, contextValue);
      },
    },
    getMemberTypes: {
      type: new GraphQLList(memberType),
      resolve: async (_source, __, contextValue) => {
        return await memberTypeGetAll(contextValue);
      },
    },
    getMemberTypeById: {
      type: memberType,
      args: {
        id: {
          description: 'member type id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_source, args, contextValue) => {
        return await memberTypeGetById(args, contextValue);
      },
    },
    userSubscribedToWithProfile: {
      type: new GraphQLList(userWithSubscribedToProfileType),
      resolve: async (_source, args, contextValue) => {
        return await getAllSubscribedProfiles(contextValue);
      },
    },
    userSubscribedToWithPosts: {
      type: userWithSubscribedToPostsType,
      args: {
        id: {
          description: 'post id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_source, args, contextValue) => {
        return await getAllSubscribedPosts(args, contextValue);
      },
    },
  }),
});

export const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: userType,
      args: {
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
      resolve: async (_source, args, contextValue) => {
        return await userCreate(args, contextValue);
      },
    },
    createProfile: {
      type: profileType,
      args: {
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
      resolve: async (_source, args, contextValue) => {
        return await profileCreate(args, contextValue);
      },
    },
  }),
});

export const rootSchema: GraphQLSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
  types: [
    userType,
    postType,
    profileType,
    memberType,
    userWithSubscribedToProfileType,
    userWithSubscribedToPostsType,
  ],
});
