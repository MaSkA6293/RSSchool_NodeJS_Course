import { ProfileEntity } from '../../../../utils/DB/entities/DBProfiles';

export const profileGetAll = async ({
  fastify,
}: any): Promise<ProfileEntity[]> => {
  const result = await fastify.inject({
    method: 'GET',
    url: '/profiles',
  });
  return result.json();
};

export const getProfileById = async (
  { id }: { id: string },
  { fastify }: any
): Promise<ProfileEntity | null> => {
  const result = await fastify.inject({
    method: 'GET',
    url: `/profiles/${id}`,
  });
  if (result.statusCode === 200) return result.json();
  return null;
};

export const profileCreate = async (
  args: {
    avatar: string;
    sex: string;
    birthday: number;
    country: string;
    street: string;
    city: string;
    userId: string;
    memberTypeId: string;
  },
  { fastify }: any
): Promise<any> => {
  return await fastify.db.profiles.create({ ...args });
};
