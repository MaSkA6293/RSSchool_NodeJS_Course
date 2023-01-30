import { UserEntity } from '../../../../utils/DB/entities/DBUsers';
import { PostEntity } from '../../../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../../../utils/DB/entities/DBProfiles';
import { MemberTypeEntity } from '../../../../utils/DB/entities/DBMemberTypes';
import { profileGetAll } from '../profile/resolver';
import { postGetAll } from '../post/resolver';

export const userGetAll = async ({
  fastify,
}: any): Promise<UserEntity[] | []> => {
  const result = await fastify.inject({
    method: 'GET',
    url: '/users',
  });
  return result.json();
};

export const userGetById = async (
  { id }: { id: string },
  { fastify }: any
): Promise<UserEntity | null> => {
  const result = await fastify.inject({
    method: 'GET',
    url: `/users/${id}`,
  });
  if (result.statusCode === 200) return result.json();
  throw new Error(
    `Bad request, check data. Probably user with ID=${id} does not exist`
  );
};

export const userGetUsersPosts = async (
  { id }: { id: string },
  { fastify }: any
): Promise<PostEntity[] | []> => {
  const posts = await fastify.inject({
    method: 'GET',
    url: `/posts`,
  });
  return posts.json().filter((post: PostEntity) => post.userId === id);
};

export const userGetUsersProfiles = async (
  { id }: { id: string },
  { fastify }: any
): Promise<ProfileEntity[] | []> => {
  const profiles = await fastify.inject({
    method: 'GET',
    url: `/profiles`,
  });
  return profiles
    .json()
    .filter((profile: ProfileEntity) => profile.userId === id)[0];
};

export const userGetUsersMemberTypes = async (
  { id }: { id: string },
  { fastify }: any
): Promise<MemberTypeEntity[]> => {
  const allProfiles = await fastify.inject({
    method: 'GET',
    url: `/profiles`,
  });

  const allUsersProfiles = allProfiles
    .json()
    .filter((profile: ProfileEntity) => profile.userId === id);

  const allUsersMemberTypes = allUsersProfiles.map(
    async (el: ProfileEntity) => {
      return await fastify.inject({
        method: 'GET',
        url: `/member-types/${el.memberTypeId}`,
      });
    }
  );

  const memberTypesData = await Promise.all(allUsersMemberTypes);

  return memberTypesData.map((el) => el.json());
};

export const getAllSubscribedProfiles = async ({
  fastify,
}: {
  fastify: any;
}): Promise<any> => {
  const users = await userGetAll({ fastify });

  const profiles = await profileGetAll({ fastify });

  return users.map((user: UserEntity) => {
    const subscribedToUserProfiles = profiles.filter((profile: ProfileEntity) =>
      user.subscribedToUserIds.includes(profile.userId)
    );

    return { ...user, subscribedToUserProfiles };
  });
};

export const getAllSubscribedToUserPosts = async (
  { id }: { id: string },
  {
    fastify,
  }: {
    fastify: any;
  }
): Promise<any> => {
  const user: UserEntity | null = await userGetById({ id }, { fastify });

  const users: UserEntity[] = await userGetAll({ fastify });

  const posts = await postGetAll({ fastify });

  if (user) {
    const followersIds = users
      .filter((item: UserEntity) => {
        if (item.subscribedToUserIds.includes(user.id)) return true;
      })
      .map((el) => el.id);

    const subscribedToUserPosts = posts.filter((post: PostEntity) => {
      if (followersIds.includes(post.userId)) return true;
    });

    return { ...user, subscribedToUserPosts };
  }
};

export const userCreate = async (
  args: {
    firstName: string;
    lastName: string;
    email: string;
  },
  { fastify }: any
): Promise<UserEntity[] | []> => {
  const result = await fastify.inject({
    method: 'POST',
    url: '/users',
    body: { ...args },
  });
  return result.json();
};

export const userUpdate = async (
  id: string,
  update: {
    firstName?: string;
    lastName?: string;
    email?: string;
    subscribedToUserIds?: string[];
  },
  { fastify }: any
): Promise<any> => {
  const result = await fastify.inject({
    method: 'PATCH',
    url: `users/${id}`,
    body: update,
  });
  if (result.statusCode === 400)
    throw new Error(
      `Bad request, check data. Probably user with ID=${id} does not exist`
    );
  return result.json();
};

export const subscribeTo = async (
  userId: string,
  subscribeToId: string,
  { fastify }: any
): Promise<any> => {
  const result = await fastify.inject({
    method: 'POST',
    url: `users/${subscribeToId}/subscribeTo`,
    body: { userId },
  });
  if (result.statusCode === 400)
    throw new Error(
      `Bad request, check data. Probably user with ID=${userId} does not exist`
    );
  return result.json();
};

export const unsubscribeFrom = async (
  userId: string,
  unsubscribeFromId: string,
  { fastify }: any
): Promise<any> => {
  const result = await fastify.inject({
    method: 'POST',
    url: `users/${unsubscribeFromId}/unsubscribeFrom`,
    body: { userId },
  });
  if (result.statusCode === 400)
    throw new Error(
      `Bad request, check data. Probably user with ID=${userId} does not exist, or this user does not have subscription = unsubscribeFromId`
    );
  return result.json();
};

export const getAllSubscribedToUserUser = async ({
  fastify,
}: {
  fastify: any;
}): Promise<any> => {
  const users: UserEntity[] = await userGetAll({ fastify });

  return users.map((user) => {
    const subscribedToUserUser = users.filter((el) => {
      if (user.subscribedToUserIds.includes(el.id)) return true;
    });
    return {
      ...user,
      userSubscribedTo: user.subscribedToUserIds,
      subscribedToUserUser: subscribedToUserUser,
    };
  });
};

export const getAllSubscribedToUserUserByID = async (
  { user }: { user: UserEntity },
  {
    fastify,
  }: {
    fastify: any;
  }
): Promise<any> => {
  const users: UserEntity[] = await userGetAll({ fastify });

  const subscribedToUserUser = users.filter((el) => {
    if (user.subscribedToUserIds.includes(el.id)) return true;
  });
  return { ...user, subscribedToUserUser: subscribedToUserUser };
};
