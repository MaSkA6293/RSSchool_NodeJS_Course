import { GraphQLSchema, GraphQLObjectType, GraphQLList } from 'graphql';

import { userType } from './user/type';
import { postType } from './post/type';
import { profileType } from './profile/type';
import { memberType } from './member-type/type';

import { userGetAll } from './user/resolver';
import { postGetAll } from './post/resolver';
import { profileGetAll } from './profile/resolver';
import { memberTypeGetAll } from './member-type/resolver';

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    getUsers: {
      type: new GraphQLList(userType),
      resolve: async (_source, __, contextValue) => {
        return await userGetAll(contextValue);
      },
    },
    getPosts: {
      type: new GraphQLList(postType),
      resolve: async (_source, __, contextValue) => {
        return await postGetAll(contextValue);
      },
    },
    getProfiles: {
      type: new GraphQLList(profileType),
      resolve: async (_source, __, contextValue) => {
        return await profileGetAll(contextValue);
      },
    },
    getMemberTypes: {
      type: new GraphQLList(memberType),
      resolve: async (_source, __, contextValue) => {
        return await memberTypeGetAll(contextValue);
      },
    },
  }),
});

export const rootSchema: GraphQLSchema = new GraphQLSchema({
  query: queryType,
  types: [userType, postType, profileType, memberType],
});
