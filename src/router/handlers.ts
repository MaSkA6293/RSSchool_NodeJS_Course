import http from 'http';
import { validate as uuidValidate } from 'uuid';
import { IUser, IUserCreate } from '../types';
import {
  validateCreateUser,
  validateUpdateUser,
  getUpdatedUsers,
} from '../helpers';

import Db from '../database/database';

export const handlerGetAllUsers = async (
  res: http.ServerResponse,
  db: Db
): Promise<void> => {
  try {
    const users = db.getUsers();
    res.statusCode = 200;
    res.end(JSON.stringify(users));
  } catch {
    res.statusCode = 500;
    res.end('server error');
  }
};

export const handlerGetUserById = async (
  res: http.ServerResponse,
  userId: string | undefined,
  db: Db
): Promise<void> => {
  try {
    if (userId && uuidValidate(userId)) {
      const user: IUser | undefined = db.getUserById(userId);
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
  res: http.ServerResponse,
  db: Db
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
          const newUser = db.createUser(jsonBody);

          res.statusCode = 201;
          res.end(JSON.stringify(newUser));
        } else {
          res.statusCode = 400;
          res.end(JSON.stringify(errors));
        }
      }
    });
};

export const handlerUpdateUser = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  userId: string | undefined,
  db: Db
): Promise<void> => {
  try {
    if (userId && uuidValidate(userId)) {
      const user = db.getUserById(userId);

      if (user) {
        const body: string[] = [];
        req
          .on('data', (chunk) => {
            body.push(chunk);
          })
          .on('end', async () => {
            const dataToReplace: IUserCreate =
              body.length > 0 ? await JSON.parse(body.toString()) : {};

            const errors = validateUpdateUser(dataToReplace);

            if (errors.length === 0) {
              const updatedUser = getUpdatedUsers(user, dataToReplace);

              db.modifyUser(updatedUser);

              res.statusCode = 200;
              res.end(JSON.stringify(updatedUser));
            } else {
              res.statusCode = 400;
              res.end(JSON.stringify(errors));
            }
          });
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

export const handlerDeleteUser = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  userId: string | undefined,
  db: Db
): Promise<void> => {
  try {
    if (userId && uuidValidate(userId)) {
      const user = db.getUserById(userId);

      if (user) {
        db.deleteUser(userId);

        res.statusCode = 204;
        res.end();
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
