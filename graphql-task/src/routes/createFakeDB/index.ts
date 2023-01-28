import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { PostEntity } from '../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { UserEntity } from '../../utils/DB/entities/DBUsers';

const users: UserEntity[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'JohnDoe@mail.com',
    subscribedToUserIds: ['2'],
  },
  {
    id: '2',
    firstName: 'Diane',
    lastName: 'Fine',
    email: 'DianaFine@mail.com',
    subscribedToUserIds: ['1'],
  },
];

const posts: PostEntity[] = [
  {
    id: '01',
    title: 'my first post John',
    content: 'after a while crocodile John 1',
    userId: '1',
  },
  {
    id: '02',
    title: 'my second post John',
    content: 'after a while crocodile John 2',
    userId: '1',
  },
  {
    id: '03',
    title: 'my second post Diana',
    content: 'after a while crocodile Diana 1',
    userId: '2',
  },
  {
    id: '04',
    title: 'my second post Diana',
    content: 'after a while crocodile Diana 2',
    userId: '2',
  },
];

const profiles: ProfileEntity[] = [
  {
    id: '1',
    avatar: 'hello John',
    sex: 'male',
    birthday: 1987,
    country: 'USA',
    street: 'First Avenue',
    city: 'New York',
    memberTypeId: 'basic',
    userId: '1',
  },
  {
    id: '2',
    avatar: 'hello John second profile',
    sex: 'male',
    birthday: 1970,
    country: 'France',
    street: 'Second Avenue',
    city: 'Paris',
    memberTypeId: 'business',
    userId: '1',
  },

  {
    id: '3',
    avatar: 'hello Diana',
    sex: 'female',
    birthday: 1991,
    country: 'USA',
    street: 'First Avenue',
    city: 'New York',
    memberTypeId: 'basic',
    userId: '2',
  },
  {
    id: '4',
    avatar: 'hello Diana second profile',
    sex: 'female',
    birthday: 1997,
    country: 'France',
    street: 'Second Avenue',
    city: 'Paris',
    memberTypeId: 'business',
    userId: '2',
  },
];

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<any> {
    const createUsers = users.map(
      async (el) => await fastify.db.users.create(el)
    );

    const userData = await Promise.all(createUsers);

    const createPosts = posts.map(async (el, i) => {
      if (i < 2) {
        return await fastify.db.posts.create({
          ...el,
          userId: userData[0].id,
        });
      } else {
        return await fastify.db.posts.create({
          ...el,
          userId: userData[1].id,
        });
      }
    });
    await Promise.all(createPosts);

    const createProfiles = profiles.map(async (el, i) => {
      await fastify.db.profiles.create(el);

      if (i < 2) {
        return await fastify.db.profiles.create({
          ...el,
          userId: userData[0].id,
        });
      } else {
        return await fastify.db.profiles.create({
          ...el,
          userId: userData[1].id,
        });
      }
    });
    await Promise.all(createProfiles);

    const subscribe = userData.map(
      async (el: UserEntity, i) =>
        await fastify.db.users.change(el.id, {
          ...el,
          subscribedToUserIds: users[i].subscribedToUserIds,
        })
    );

    await Promise.all(subscribe);
    return 'the fake db was successfully created';
  });
};

export default plugin;
