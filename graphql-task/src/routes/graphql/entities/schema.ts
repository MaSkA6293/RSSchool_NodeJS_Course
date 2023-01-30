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
  userByIdWithSubscribedToUserPostsType,
  userCreateInputType,
  userUpdateInputType,
  userCheckDepthType,
} from './user/type';
import {
  postType,
  postCreateInputType,
  postUpdateInputType,
} from './post/type';
import {
  profileType,
  profileCreateInputType,
  profileUpdateInputType,
} from './profile/type';
import { memberType, memberTypeUpdateInputType } from './member-type/type';

import {
  userGetAll,
  userGetById,
  getAllSubscribedProfiles,
  getAllSubscribedToUserPosts,
  userCreate,
  userUpdate,
  subscribeTo,
  unsubscribeFrom,
  getAllSubscribedToUserUser,
} from './user/resolver';
import {
  postGetAll,
  postGetById,
  postCreate,
  postUpdate,
} from './post/resolver';
import {
  profileGetAll,
  getProfileById,
  profileCreate,
  profileUpdate,
} from './profile/resolver';
import {
  memberTypeGetAll,
  memberTypeGetById,
  memberTypeUpdate,
} from './member-type/resolver';
import { getUpdateObject } from '../utils';

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
    userByIdWithSubscribedToUserPosts: {
      type: userByIdWithSubscribedToUserPostsType,
      args: {
        id: {
          description: 'post id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_source, args, contextValue) => {
        return await getAllSubscribedToUserPosts(args, contextValue);
      },
    },
    checkDepth: {
      type: new GraphQLList(userCheckDepthType),
      resolve: async (_source, args, contextValue) => {
        const result = await getAllSubscribedToUserUser(contextValue);
        return result;
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

    createPost: {
      type: postType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_source, args, contextValue) => {
        return await postCreate(args, contextValue);
      },
    },

    updateUser: {
      type: userType,
      args: {
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
      resolve: async (_source, args, contextValue) => {
        const { id }: { id: string } = args;
        const update = getUpdateObject(args);

        return await userUpdate(id, update, contextValue);
      },
    },

    updateProfile: {
      type: profileType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        avatar: { type: GraphQLString },
        sex: { type: GraphQLString },
        birthday: { type: GraphQLInt },
        country: { type: GraphQLString },
        street: { type: GraphQLString },
        city: { type: GraphQLString },
        memberTypeId: {
          type: GraphQLString,
        },
      },
      resolve: async (_source, args, contextValue) => {
        const { id }: { id: string } = args;
        const update = getUpdateObject(args);
        return await profileUpdate(id, update, contextValue);
      },
    },

    updatePost: {
      type: postType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
      },
      resolve: async (_source, args, contextValue) => {
        const { id }: { id: string } = args;
        const update = getUpdateObject(args);
        return await postUpdate(id, update, contextValue);
      },
    },

    updateMemberType: {
      type: memberType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        discount: { type: GraphQLInt },
        monthPostsLimit: { type: GraphQLInt },
      },
      resolve: async (_source, args, contextValue) => {
        const { id }: { id: string } = args;
        const update = getUpdateObject(args);
        return await memberTypeUpdate(id, update, contextValue);
      },
    },

    subscribeTo: {
      type: userType,
      args: {
        userId: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'the id of the user',
        },
        subscribeToId: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'the id of the subscribeTo user',
        },
      },
      resolve: async (_source, args, contextValue) => {
        const {
          userId,
          subscribeToId,
        }: { userId: string; subscribeToId: string } = args;

        return await subscribeTo(userId, subscribeToId, contextValue);
      },
    },

    unsubscribeFrom: {
      type: userType,
      args: {
        userId: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'the id of the user',
        },
        unsubscribeFromId: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'the id of the unsubscribe user',
        },
      },
      resolve: async (_source, args, contextValue) => {
        const {
          userId,
          unsubscribeFromId,
        }: { userId: string; unsubscribeFromId: string } = args;

        return await unsubscribeFrom(userId, unsubscribeFromId, contextValue);
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
    userByIdWithSubscribedToUserPostsType,
    userCreateInputType,
    userUpdateInputType,
    memberTypeUpdateInputType,
    postCreateInputType,
    postUpdateInputType,
    profileCreateInputType,
    profileUpdateInputType,
    userCheckDepthType,
  ],
});
