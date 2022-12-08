import supertest from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import app from '../app';
import { IUser, IUserCreate } from '../types';

const pathToDb = resolve(__dirname, '../database/db.json');

beforeEach(async () => {
  const db: { users: IUser[] } = {
    users: [
      {
        id: 'df10de70-8ab6-40c7-8432-3f3cfd9b6226',
        username: 'Jon',
        age: 35,
        hobbies: ['skating', 'fishing', 'running'],
      },
      {
        id: '962eb785-b7e3-48c1-b7fa-cfdb465c80ff',
        username: 'Anna',
        age: 32,
        hobbies: ['knitting', 'dancing', 'cooking'],
      },
    ],
  };
  try {
    await writeFile(pathToDb, JSON.stringify(db));
  } catch {
    // eslint-disable-next-line no-console
    console.error('Error reading dataBase file');
  }
});

describe('GET api/users', () => {
  test('Should answer with status code 200', async () => {
    const response: supertest.Response = await supertest(app)
      .get('/api/users')
      .send();

    expect(response.statusCode).toBe(200);
  });

  test('Server should send all users records', async () => {
    const db = await readFile(pathToDb, 'utf-8');

    const { users }: { users: IUser[] } = JSON.parse(db);

    const response: supertest.Response = await supertest(app)
      .get('/api/users')
      .send();

    expect(response.body.length).toEqual(users.length);
  });
});

describe(`GET api/users/\${userId}`, () => {
  test('Server should answer with status code 200', async () => {
    const db = await readFile(pathToDb, 'utf-8');

    const { users }: { users: IUser[] } = JSON.parse(db);

    const response: supertest.Response = await supertest(app)
      .get(`/api/users/${users[0].id}`)
      .send();

    expect(response.statusCode).toBe(200);
  });

  test(`Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)`, async () => {
    const response: supertest.Response = await supertest(app)
      .get(`/api/users/12`)
      .send();

    expect(response.statusCode).toBe(400);

    expect(response.body.message).toBe(`userId is invalid id=12`);
  });

  test(`Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist)`, async () => {
    const nonExistingId = uuidv4();
    const response: supertest.Response = await supertest(app)
      .get(`/api/users/${nonExistingId}`)
      .send();

    expect(response.statusCode).toBe(404);

    expect(response.body.message).toBe(
      `The user with id=${nonExistingId} doesn't exist`
    );
  });
});

describe('Errors on the server side', () => {
  test('server should answer with status code 500 and corresponding human-friendly message', async () => {
    const response: supertest.Response = await supertest(app)
      .get(`/api/throwError`)
      .send();

    expect(response.body.message).toBe(
      `Unfortunately an internal error as occurred, we're already working on it`
    );
  });
});

describe('Non existing endpoint', () => {
  const testEndpoints: string[] = [
    '/api/unknownEndpoint',
    '/some-non/existing/resource',
    '/api/in/the/middle/of/nowhere',
  ];
  test('server should answer with status code 404 and corresponding human-friendly message', async () => {
    const requestsArr: Promise<supertest.Response>[] = testEndpoints.map((el) =>
      supertest(app).get(el).send()
    );

    const requestsResult = await Promise.allSettled(requestsArr);

    requestsResult.forEach(
      (el: PromiseSettledResult<supertest.Response>, i: number) => {
        if (el.status === 'fulfilled') {
          expect(el.value.status).toBe(404);
          expect(el.value.body.message).toBe(
            `Non-existing endpoint ${testEndpoints[i]}`
          );
        } else {
          throw new Error('One of the requests was rejected');
        }
      }
    );
  });
});

describe('POST api/users', () => {
  const newUser: IUserCreate = {
    username: 'John',
    age: 35,
    hobbies: ['Tennis', 'Train watching'],
  };

  test('Should answer with status code 201', async () => {
    const response: supertest.Response = await supertest(app)
      .post('/api/users')
      .send(newUser);

    expect(response.statusCode).toBe(201);
  });

  test('Server should send newly created record, check dataBase with new record', async () => {
    const response: supertest.Response = await supertest(app)
      .post('/api/users')
      .send(newUser);

    const { body } = response;

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('username', newUser.username);
    expect(body).toHaveProperty('age', newUser.age);
    expect(body).toHaveProperty('hobbies', ['Tennis', 'Train watching']);

    const allUsers: supertest.Response = await supertest(app)
      .get('/api/users')
      .send();

    const users: IUser[] = allUsers.body;

    const checkAddNewUser = users.find((el) => el.id === body.id);

    expect(checkAddNewUser).not.toBe(undefined);
  });

  test('Server should send age and hobbies missing fields', async () => {
    const user: Partial<IUserCreate> = {
      username: 'John',
    };
    const response: supertest.Response = await supertest(app)
      .post('/api/users')
      .send(user);

    const { body } = response;

    const error = [
      'age : the field age is required',
      'hobbies : the field hobbies is required',
    ];
    expect(body).toEqual(error);
  });

  test('Server should send username and hobbies missing fields', async () => {
    const user: Partial<IUserCreate> = {
      age: 35,
    };
    const response: supertest.Response = await supertest(app)
      .post('/api/users')
      .send(user);

    const { body } = response;

    const error = [
      'username : the field username is required',
      'hobbies : the field hobbies is required',
    ];
    expect(body).toEqual(error);
  });

  test('Server should send all missing fields', async () => {
    const response: supertest.Response = await supertest(app)
      .post('/api/users')
      .send(undefined);

    const { body } = response;

    const error = [
      'username : the field username is required',
      'age : the field age is required',
      'hobbies : the field hobbies is required',
    ];
    expect(body).toEqual(error);
  });

  test('No errors if hobbies is []', async () => {
    const user = {
      username: 'John',
      age: 35,
      hobbies: [],
    };
    const response: supertest.Response = await supertest(app)
      .post('/api/users')
      .send(user);

    const { body } = response;

    expect(body).toHaveProperty('hobbies', user.hobbies);
  });
});
