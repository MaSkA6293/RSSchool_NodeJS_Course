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
  const result = await fastify.inject({
    method: 'POST',
    url: `/profiles`,
    body: { ...args },
  });
  if (result.statusCode === 200) return result.json();
  throw new Error(
    `Bad request, check data. Probably user with userId = ${args.userId} does not exist, also check memberTypeId is correct. And the user probably already has profile!`
  );
};

export const profileUpdate = async (
  id: string,
  update: {
    avatar?: string;
    sex?: string;
    birthday?: number;
    country?: string;
    street?: string;
    city?: string;
    memberTypeId?: string;
  },
  { fastify }: any
): Promise<any> => {
  const result = await fastify.inject({
    method: 'PATCH',
    url: `profiles/${id}`,
    body: update,
  });
  if (result.statusCode === 400)
    throw new Error(
      `Bad request, check data. Probably post with ID=${id} does not exist`
    );
  return result.json();
};
