import supertest from 'supertest';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import app from '../app';

const pathToDb = resolve(__dirname, '../database/db.json');

let dbOriginal = '';

beforeAll(async () => {
  try {
    const data = await readFile(pathToDb, 'utf-8');
    dbOriginal = JSON.parse(data);

    const fakeDb = { users: [] };

    await writeFile(pathToDb, JSON.stringify(fakeDb));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error rewriting original dataBase file with fakeDb file', e);
  }
});

afterAll(async () => {
  try {
    await writeFile(pathToDb, JSON.stringify(dbOriginal));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error writing original dataBase in file', e);
  }
});

describe('Scenario one', () => {
  const newRecord = {
    username: 'John',
    age: 35,
    hobbies: ['Tennis', 'Train watching'],
  };

  let idNewRecord = '';

  test('Get all records with a GET api/users request (an empty array is expected)', async () => {
    const response: supertest.Response = await supertest(app)
      .get('/api/users')
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual([]);
  });

  test('A new object is created by a POST api/users request (a response containing newly created record is expected)', async () => {
    const response: supertest.Response = await supertest(app)
      .post('/api/users')
      .send(newRecord);

    expect(response.statusCode).toBe(201);

    const { body } = response;
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('username', newRecord.username);
    expect(body).toHaveProperty('age', newRecord.age);
    expect(body).toHaveProperty('hobbies', ['Tennis', 'Train watching']);

    idNewRecord = body.id;
  });

  test('With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)', async () => {
    const response: supertest.Response = await supertest(app)
      .get(`/api/users/${idNewRecord}`)
      .send();

    expect(response.statusCode).toBe(200);

    const { body } = response;
    expect(body).toHaveProperty('id', idNewRecord);
    expect(body).toHaveProperty('username', newRecord.username);
    expect(body).toHaveProperty('age', newRecord.age);
    expect(body).toHaveProperty('hobbies', ['Tennis', 'Train watching']);
  });

  test('We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)', async () => {
    const update = { username: 'Ted', age: 32 };

    const response: supertest.Response = await supertest(app)
      .put(`/api/users/${idNewRecord}`)
      .send(update);

    expect(response.statusCode).toBe(200);

    const { body } = response;
    expect(body).toHaveProperty('id', idNewRecord);
    expect(body).toHaveProperty('username', update.username);
    expect(body).toHaveProperty('age', update.age);
    expect(body).toHaveProperty('hobbies', ['Tennis', 'Train watching']);
  });

  test('With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)', async () => {
    const response: supertest.Response = await supertest(app)
      .delete(`/api/users/${idNewRecord}`)
      .send();

    expect(response.statusCode).toBe(204);
  });

  test('With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)', async () => {
    const getDeletedObject: supertest.Response = await supertest(app)
      .get(`/api/users/${idNewRecord}`)
      .send();

    expect(getDeletedObject.statusCode).toBe(404);
  });
});
