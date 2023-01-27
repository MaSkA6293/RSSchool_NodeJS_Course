import { MemberTypeEntity } from '../../../../utils/DB/entities/DBMemberTypes';

export async function memberTypeGetAll({
  fastify,
}: any): Promise<MemberTypeEntity[] | []> {
  return await fastify.db.memberTypes.findMany();
}
