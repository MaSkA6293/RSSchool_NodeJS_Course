import { UserEntity } from '../../../../utils/DB/entities/DBUsers';

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
