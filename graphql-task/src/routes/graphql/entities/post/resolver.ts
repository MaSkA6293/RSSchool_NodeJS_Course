import { PostEntity } from '../../../../utils/DB/entities/DBPosts';

export const postGetAll = async ({ fastify }: any): Promise<PostEntity[]> => {
  const result = await fastify.inject({
    method: 'GET',
    url: '/posts',
  });
  return result.json();
};

export const postGetById = async (
  { id }: { id: string },
  { fastify }: any
): Promise<PostEntity | null> => {
  const result = await fastify.inject({
    method: 'GET',
    url: `/posts/${id}`,
  });
  if (result.statusCode === 200) return result.json();
  return null;
};
