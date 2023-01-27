import { UserEntity } from '../../../../utils/DB/entities/DBUsers';

export async function userGetAll({ fastify }: any): Promise<UserEntity[] | []> {
  return await fastify.db.users.findMany();
}
