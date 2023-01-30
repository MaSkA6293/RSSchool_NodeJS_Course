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

export const postCreate = async (
  args: {
    title: string;
    content: string;
    userId: string;
  },
  { fastify }: any
): Promise<any> => {
  const result = await fastify.inject({
    method: 'POST',
    url: `/posts`,
    body: args,
  });
  if (result.statusCode === 200) return result.json();

  throw new Error(
    `Bad request, check data. Probably user with ID=${args.userId} does not exist`
  );
};

export const postUpdate = async (
  id: string,
  update: {
    title?: string;
    content?: string;
  },
  { fastify }: any
): Promise<any> => {
  const result = await fastify.inject({
    method: 'PATCH',
    url: `posts/${id}`,
    body: update,
  });
  if (result.statusCode === 400)
    throw new Error(
      `Bad request, check data. Probably post with ID=${id} does not exist`
    );
  return result.json();
};
