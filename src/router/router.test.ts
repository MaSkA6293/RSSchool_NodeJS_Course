import supertest from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import app from '../app';
import db from '../db';

describe('GET api/users', () => {
  test('Should answer with status code 200', async () => {
    const response: supertest.Response = await supertest(app)
      .get('/api/users')
      .send();

    expect(response.statusCode).toBe(200);
  });

  test('Server should send all users records', async () => {
    const response: supertest.Response = await supertest(app)
      .get('/api/users')
      .send();

    expect(response.body.length).toEqual(2);
  });
});

describe(`GET api/users/\${userId}`, () => {
  test('Server should answer with status code 200', async () => {
    const response: supertest.Response = await supertest(app)
      .get(`/api/users/${db[0].id}`)
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
