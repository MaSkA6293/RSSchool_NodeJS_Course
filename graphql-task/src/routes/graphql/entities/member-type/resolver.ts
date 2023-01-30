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

export const memberTypeUpdate = async (
  id: string,
  update: {
    discount?: number;
    monthPostsLimit?: number;
  },
  { fastify }: any
): Promise<any> => {
  const result = await fastify.inject({
    method: 'PATCH',
    url: `member-types/${id}`,
    body: update,
  });
  if (result.statusCode === 400)
    throw new Error(
      `Bad request, check data. Probably member-type with ID=${id} does not exist`
    );
  return result.json();
};
