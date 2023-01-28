import { UserEntity } from '../../../../utils/DB/entities/DBUsers';
import { PostEntity } from '../../../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../../../utils/DB/entities/DBProfiles';
import { MemberTypeEntity } from '../../../../utils/DB/entities/DBMemberTypes';

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
  return null;
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
    .filter((profile: ProfileEntity) => profile.userId === id);
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
