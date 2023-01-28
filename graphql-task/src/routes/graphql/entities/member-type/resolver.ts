import { MemberTypeEntity } from '../../../../utils/DB/entities/DBMemberTypes';

export const memberTypeGetAll = async ({
  fastify,
}: any): Promise<MemberTypeEntity[] | []> => {
  const result = await fastify.inject({
    method: 'GET',
    url: '/member-types',
  });
  return result.json();
};

export const memberTypeGetById = async (
  { id }: { id: string },
  { fastify }: any
): Promise<MemberTypeEntity | null> => {
  const result = await fastify.inject({
    method: 'GET',
    url: `/member-types/${id}`,
  });
  if (result.statusCode === 200) return result.json();
  return null;
};
