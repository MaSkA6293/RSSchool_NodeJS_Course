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
