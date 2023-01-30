import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    const profiles = await fastify.db.profiles.findMany();
    return profiles;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;

      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: id,
      });

      if (profile) return profile;

      throw fastify.httpErrors.notFound();
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { memberTypeId, userId } = request.body;

      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: memberTypeId,
      });

      const profile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: userId,
      });

      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: userId,
      });

      if (memberType && user && !profile) {
        return await fastify.db.profiles.create(request.body);
      }

      throw fastify.httpErrors.badRequest();
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;

      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: id,
      });

      if (profile) {
        return await fastify.db.profiles.delete(id);
      }

      throw fastify.httpErrors.badRequest();
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;

      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: id,
      });

      if (profile) {
        return await fastify.db.profiles.change(id, request.body);
      }

      throw fastify.httpErrors.badRequest();
    }
  );
};

export default plugin;
