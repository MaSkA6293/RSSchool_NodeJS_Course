import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;

      const user = await fastify.db.users.findOne({ key: 'id', equals: id });
      if (user) return user;

      throw fastify.httpErrors.notFound();
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return await fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;

      const users = await fastify.db.users.findMany();

      const user = await fastify.db.users.findOne({ key: 'id', equals: id });

      if (user) {
        const profiles = await fastify.db.profiles.findMany();
        const profilesDelete = profiles
          .filter((el: ProfileEntity) => el.userId === id)
          .map(
            async (el: ProfileEntity) => await fastify.db.profiles.delete(el.id)
          );
        await Promise.all(profilesDelete);

        const posts = await fastify.db.posts.findMany();
        const postsDelete = posts
          .filter((el: PostEntity) => el.userId === id)
          .map(async (el: PostEntity) => await fastify.db.posts.delete(el.id));
        await Promise.all(postsDelete);

        const usersUpdate = users
          .filter((el: UserEntity) => {
            if (el.subscribedToUserIds.includes(id)) return true;
          })
          .map(async (el: UserEntity) => {
            const modifiedUser = {
              ...el,
              subscribedToUserIds: el.subscribedToUserIds.filter(
                (el) => el !== id
              ),
            };
            return await fastify.db.users.change(id, modifiedUser);
          });
        await Promise.all(usersUpdate);

        return await fastify.db.users.delete(id);
      }

      throw fastify.httpErrors.badRequest();
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;

      const { userId } = request.body;

      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: userId,
      });

      if (user) {
        if (user.subscribedToUserIds.includes(id)) return user;
        const modifiedUser = {
          ...user,
          subscribedToUserIds: [...user.subscribedToUserIds, id],
        };
        return await fastify.db.users.change(userId, modifiedUser);
      }

      throw fastify.httpErrors.badRequest();
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const { userId } = request.body;

      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: userId,
      });

      if (user) {
        const alreadySubscribed = user.subscribedToUserIds.includes(id);

        if (alreadySubscribed) {
          const modifiedUser = {
            ...user,
            subscribedToUserIds: user.subscribedToUserIds.filter(
              (el) => el !== id
            ),
          };
          return await fastify.db.users.change(userId, modifiedUser);
        }
      }

      throw fastify.httpErrors.badRequest();
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;

      const user = await fastify.db.users.findOne({ key: 'id', equals: id });

      if (user) {
        return await fastify.db.users.change(id, request.body);
      }

      throw fastify.httpErrors.badRequest();
    }
  );
};

export default plugin;
