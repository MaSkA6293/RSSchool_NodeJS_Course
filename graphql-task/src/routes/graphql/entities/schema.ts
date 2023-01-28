import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import { userType } from './user/type';
import { postType } from './post/type';
import { profileType } from './profile/type';
import { memberType } from './member-type/type';

import { userGetAll, userGetById } from './user/resolver';
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
  }),
});

export const rootSchema: GraphQLSchema = new GraphQLSchema({
  query: queryType,
  types: [userType, postType, profileType, memberType],
});