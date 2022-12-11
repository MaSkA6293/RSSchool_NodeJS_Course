import supertest from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../types';
import app from '../app';

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

describe('Scenario one', () => {
  const newRecord = {
    username: 'John',
    age: 35,
    hobbies: ['Tennis', 'Train watching'],
  };

  let idNewRecord = '';

  beforeAll(() => cleanDb());

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

describe('Scenario two', () => {
  beforeAll(() => cleanDb());

  const newRecords: IUser[] = [
    {
      id: '',
      username: 'John',
      age: 35,
      hobbies: ['Tennis', 'Train watching'],
    },
    {
      id: '',
      username: 'Tom',
      age: 35,
      hobbies: ['Fishing', 'Cycling'],
    },
    {
      id: '',
      username: 'Anna',
      age: 35,
      hobbies: ['Cooking', 'Running'],
    },
  ];

  test('Create three new records', async () => {
    const allCreate = newRecords.map(
      (el: IUser, i: number) =>
        new Promise((res) => {
          supertest(app)
            .post('/api/users')
            .send(el)
            .then((data) => {
              newRecords[i].id = data.body.id;
              res(data);
            });
        })
    );

    await Promise.allSettled(allCreate);

    const getAllRecords = await supertest(app).get('/api/users').send();

    expect(getAllRecords.statusCode).toBe(200);
    expect((getAllRecords.body as IUser[]).length).toBe(3);
  });

  test('Remove two first records', async () => {
    const getAllRecords = await supertest(app).get('/api/users').send();

    const users = getAllRecords.body;

    expect(users.length).toBe(3);

    const forDelete = users.slice(0, 2);

    const deletePromise = forDelete.map(
      (el: IUser) =>
        new Promise((res) => {
          supertest(app)
            .delete(`/api/users/${el.id}`)
            .send()
            .then((data) => res(data));
        })
    );

    await Promise.allSettled(deletePromise);

    const getAllAfterDelete = await supertest(app).get('/api/users').send();

    const usersAfterDelete = getAllAfterDelete.body;

    expect(usersAfterDelete.length).toBe(1);
  });

  test('Create two records again', async () => {
    const forCreate = newRecords.slice(0, 2);

    const allCreate = forCreate.map(
      (el: IUser) =>
        new Promise((res) => {
          supertest(app)
            .post('/api/users')
            .send(el)
            .then((data) => res(data));
        })
    );

    await Promise.allSettled(allCreate);

    const getAllAfterCreate = await supertest(app).get('/api/users').send();

    const usersAfterCreate = getAllAfterCreate.body;

    expect(usersAfterCreate.length).toBe(3);
  });

  test('Send three wrong requests to create new record', async () => {
    interface IWrongUserCreate {
      username: number;
      age: string;
      hobbies: string | number;
    }

    const newIncorrectRecords: IWrongUserCreate[] = [
      {
        username: 35,
        age: 'John',
        hobbies: "['Tennis', 'Train watching']",
      },
      {
        username: 35,
        age: 'John',
        hobbies: 22,
      },
      {
        username: 35,
        age: 'John',
        hobbies: 16,
      },
    ];

    const responseWrongData: string[] = [
      'username : the field mast be of type string',
      'age : the field mast be of type number',
      'hobbies : the field mast be of type string [], or empty []',
    ];

    newIncorrectRecords.map(
      (el: IWrongUserCreate) =>
        new Promise((res) => {
          supertest(app)
            .post('/api/users')
            .send(el)
            .then((response: supertest.Response) => {
              expect(response.body).toEqual(responseWrongData);
              res(response.body);
            });
        })
    );

    const getAllAfterCreate = await supertest(app).get('/api/users').send();

    const usersAfterCreate = getAllAfterCreate.body;

    expect(usersAfterCreate.length).toBe(3);
  });

  test('Try to delete notExisting records', async () => {
    const notExistingIds: string[] = [uuidv4(), uuidv4(), uuidv4()];

    notExistingIds.map(
      (id: string) =>
        new Promise((res) => {
          supertest(app)
            .delete(`/api/users/${id}`)
            .send()
            .then((response: supertest.Response) => {
              const answer = {
                message: `The user with id=${id} doesn't exist`,
              };
              expect(response.body).toEqual(answer);
              res(response.body);
            });
        })
    );

    const getAllAfterRequests = await supertest(app).get('/api/users').send();

    const usersAfterRequest = getAllAfterRequests.body;

    expect(usersAfterRequest.length).toBe(3);
  });

  test('Try to send incorrect routs, GET, POST, DELETE, PUT ', async () => {
    const notExistingRoutes: string[] = [
      '/api/data',
      '/messages/home',
      '/contacts/pay',
      '/api/contacts/pay',
      '/api/users/pay/dead',
    ];

    notExistingRoutes.map(
      (route: string) =>
        new Promise((res) => {
          supertest(app)
            .get(`${route}`)
            .send()
            .then((response: supertest.Response) => {
              const answer = {
                message: `Non-existing endpoint ${route}`,
              };

              expect(response.body).toEqual(answer);
              res(response.body);
            });
        })
    );

    notExistingRoutes.map(
      (route: string) =>
        new Promise((res) => {
          supertest(app)
            .post(`${route}`)
            .send()
            .then((response: supertest.Response) => {
              const answer = {
                message: `Non-existing endpoint ${route}`,
              };

              expect(response.body).toEqual(answer);
              res(response.body);
            });
        })
    );

    notExistingRoutes.map(
      (route: string) =>
        new Promise((res) => {
          supertest(app)
            .delete(`${route}`)
            .send()
            .then((response: supertest.Response) => {
              const answer = {
                message: `Non-existing endpoint ${route}`,
              };

              expect(response.body).toEqual(answer);
              res(response.body);
            });
        })
    );

    notExistingRoutes.map(
      (route: string) =>
        new Promise((res) => {
          supertest(app)
            .put(`${route}`)
            .send()
            .then((response: supertest.Response) => {
              const answer = {
                message: `Non-existing endpoint ${route}`,
              };

              expect(response.body).toEqual(answer);
              res(response.body);
            });
        })
    );

    const getAllAfterRequests = await supertest(app).get('/api/users').send();
    const usersAfterRequests = getAllAfterRequests.body;
    expect(usersAfterRequests.length).toBe(3);
  });
});
