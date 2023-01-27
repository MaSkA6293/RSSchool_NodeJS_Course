import { ProfileEntity } from '../../../../utils/DB/entities/DBProfiles';

export async function profileGetAll({
  fastify,
}: any): Promise<ProfileEntity[] | []> {
  return await fastify.db.profiles.findMany();
}
