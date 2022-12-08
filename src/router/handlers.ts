import http from 'http';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { IUser, IUserCreate } from '../types';
import { validateCreateUser } from '../helpers';

export const handlerGetAllUsers = async (
  res: http.ServerResponse
): Promise<void> => {
  const pathToFile = path.join(__dirname, '../database/db.json');

  try {
    const db = await readFile(pathToFile, 'utf-8');
    const { users }: { users: IUser[] } = await JSON.parse(db);

    res.statusCode = 200;
    res.end(JSON.stringify(users));
  } catch {
    res.statusCode = 500;
    res.end('server error');
  }
};

export const handlerGetUserById = async (
  res: http.ServerResponse,
  userId: string | undefined
): Promise<void> => {
  try {
    if (userId && uuidValidate(userId)) {
      const pathToFile = path.join(__dirname, '../database/db.json');
      const db = await readFile(pathToFile, 'utf-8');
      const { users }: { users: IUser[] } = await JSON.parse(db);

      const user: IUser | undefined = users.find((el) => el.id === userId);
      if (user) {
        res.statusCode = 200;
        res.end(JSON.stringify(user));
      } else {
        res.statusCode = 404;
        const err = {
          message: `The user with id=${userId} doesn't exist`,
        };
        res.end(JSON.stringify(err));
      }
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: `userId is invalid id=${userId}` }));
    }
  } catch {
    res.statusCode = 500;
    res.end('server error');
  }
};

export const handlerServerError = (res: http.ServerResponse) => {
  res.statusCode = 500;
  res.end(
    JSON.stringify({
      message: `Unfortunately an internal error as occurred, we're already working on it`,
    })
  );
};

export const handlerCreateUser = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  const body: string[] = [];
  req
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', async () => {
      const jsonBody: IUserCreate =
        body.length > 0 ? await JSON.parse(body.toString()) : [];

      if (jsonBody !== undefined && typeof jsonBody === 'object') {
        const errors = validateCreateUser(jsonBody);
        if (errors.length === 0) {
          const newUser = { ...jsonBody, id: uuidv4() };

          const pathToFile = path.join(__dirname, '../database/db.json');
          const db = await readFile(pathToFile, 'utf-8');
          const { users }: { users: IUser[] } = await JSON.parse(db);

          const bdUpdate = { users: [...users, newUser] };

          await writeFile(pathToFile, JSON.stringify(bdUpdate));
          res.statusCode = 201;
          res.end(JSON.stringify(newUser));
        } else {
          res.statusCode = 400;
          res.end(JSON.stringify(errors));
        }
      }
    });
};
