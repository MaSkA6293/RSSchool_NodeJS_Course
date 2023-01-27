import { PostEntity } from '../../../../utils/DB/entities/DBPosts';

export async function postGetAll({ fastify }: any): Promise<PostEntity[] | []> {
  return await fastify.db.posts.findMany();
}
