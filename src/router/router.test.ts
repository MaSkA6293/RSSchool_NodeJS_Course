import supertest from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import app from '../app';
import { IUser, IUserCreate } from '../types';

const fakeDb: { users: IUser[] } = {
  users: [
    {
      id: '',
      username: 'Jon',
      age: 35,
      hobbies: ['skating', 'fishing', 'running'],
    },
    {
      id: '',
      username: 'Anna',
      age: 32,
      hobbies: ['knitting', 'dancing', 'cooking'],
    },
  ],
};

const setDb = async () => {
  try {
    const allCreate = fakeDb.users.map(
      (el: IUser, i: number) =>
        new Promise((res) => {
          supertest(app)
            .post(`/api/users`)
            .send(el)
            .then((data) => {
              fakeDb.users[i].id = data.body.id;
              res(data);
            });
        })
    );

    await Promise.allSettled(allCreate);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error reading original dataBase file', e);
  }
};

const cleanDb = async () => {
  try {
    const request = await supertest(app).get('/api/users').send();

    const users = request.body;

    const allDelete = users.map(
      (el: IUser) =>
        new Promise((res) => {
          supertest(app)
            .delete(`/api/users/${el.id}`)
            .send()
            .then((data) => res(data));
        })
    );

    await Promise.allSettled(allDelete);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error reading original dataBase file', e);
  }
};

describe('GET api/users', () => {
  beforeEach(async () => {
    await cleanDb();
    await setDb();
  });

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

    expect(response.body.length).toEqual(fakeDb.users.length);
  });
});

describe(`GET api/users/\${userId}`, () => {
  test('Server should answer with status code 200', async () => {
    const response: supertest.Response = await supertest(app)
      .get(`/api/users/${fakeDb.users[0].id}`)
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

describe('PUT api/users', () => {
  const updateRecord: IUserCreate = {
    username: 'New name',
    age: 19,
    hobbies: ['test1', 'test2'],
  };

  test('Should answer with status code 200', async () => {
    const getAllUsers: supertest.Response = await supertest(app)
      .get(`/api/users`)
      .send();

    const users = getAllUsers.body;

    const response: supertest.Response = await supertest(app)
      .put(`/api/users/${users[0].id}`)
      .send(updateRecord);

    expect(response.statusCode).toBe(200);
  });

  test('Server should send updated record, check dataBase with updated record', async () => {
    const getAllUsers: supertest.Response = await supertest(app)
      .get(`/api/users`)
      .send();

    const users = getAllUsers.body;

    const responseGetUser: supertest.Response = await supertest(app)
      .get(`/api/users/${users[0].id}`)
      .send();

    const candidate: IUser = responseGetUser.body;

    const responseUpdate: supertest.Response = await supertest(app)
      .put(`/api/users/${candidate.id}`)
      .send(updateRecord);

    const updatedRecord = responseUpdate.body;

    expect(updatedRecord).toHaveProperty('username', updateRecord.username);
    expect(updatedRecord).toHaveProperty('age', updateRecord.age);
    expect(updatedRecord).toHaveProperty('hobbies', updateRecord.hobbies);
    expect(updatedRecord).toHaveProperty('id', candidate.id);

    const responseAll: supertest.Response = await supertest(app)
      .get(`/api/users`)
      .send();

    const candidateUpdated = responseAll.body.find(
      (el: IUser) => el.id === updatedRecord.id
    );

    expect(candidateUpdated).toEqual(updatedRecord);
  });

  test('Server should send array of errors with incorrect fields', async () => {
    const getAllUsers: supertest.Response = await supertest(app)
      .get(`/api/users`)
      .send();

    const users = getAllUsers.body;
    const incorrectUpdate = {
      usernam: 'New name - incorrect field name',
      age: 'string is not allowed',
      hobbies: [1, '2'],
      id: 'not allowed to change id',
    };

    const responseUpdate: supertest.Response = await supertest(app)
      .put(`/api/users/${users[0].id}`)
      .send(incorrectUpdate);

    const error = [
      'The key: usernam is incorrect',
      'age : the field mast be of type number',
      'hobbies : the field mast be of type string [], or empty []. One of the elements has incorrect type',
      'The key: id is incorrect',
    ];
    expect(responseUpdate.body).toEqual(error);
  });

  test('Server should answer with status code 404, user does not exist', async () => {
    const nonExistingId = uuidv4();

    const responseUpdate: supertest.Response = await supertest(app)
      .put(`/api/users/${nonExistingId}`)
      .send(updateRecord);

    expect(responseUpdate.statusCode).toBe(404);

    expect(responseUpdate.body.message).toBe(
      `The user with id=${nonExistingId} doesn't exist`
    );
  });

  test('Should answer with status code 400 and corresponding message if userId is invalid (not uuid)', async () => {
    const response: supertest.Response = await supertest(app)
      .put(`/api/users/12`)
      .send(updateRecord);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(`userId is invalid id=12`);
  });
});

describe('DELETE api/users', () => {
  test('Should answer with status code 204 if the record is found and deleted', async () => {
    const getAllUsers: supertest.Response = await supertest(app)
      .get(`/api/users`)
      .send();

    const users = getAllUsers.body;
    const willBeDeletedId = users[0].id;
    const response: supertest.Response = await supertest(app)
      .delete(`/api/users/${willBeDeletedId}`)
      .send();

    expect(response.statusCode).toBe(204);

    const checkDeletedUser: supertest.Response = await supertest(app)
      .get(`/api/users/${willBeDeletedId}`)
      .send();

    expect(checkDeletedUser.statusCode).toBe(404);

    expect(checkDeletedUser.body.message).toBe(
      `The user with id=${willBeDeletedId} doesn't exist`
    );
  });

  test('Should answer with status code 400 and corresponding message if userId is invalid (not uuid)', async () => {
    const response: supertest.Response = await supertest(app)
      .delete(`/api/users/12`)
      .send();

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(`userId is invalid id=12`);
  });

  test('Should answer with status code 404 and corresponding message if record with id === userId does not exist', async () => {
    const nonExistingId = uuidv4();

    const response: supertest.Response = await supertest(app)
      .delete(`/api/users/${nonExistingId}`)
      .send();

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      `The user with id=${nonExistingId} doesn't exist`
    );
  });
});
