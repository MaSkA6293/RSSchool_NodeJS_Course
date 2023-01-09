import http from 'http';
import { validate as uuidValidate } from 'uuid';
import { IUser, IUserCreate } from '../types';
import {
  validateCreateUser,
  validateUpdateUser,
  getUpdatedUsers,
  checkDataFormat,
} from '../helpers';

import dataBase from '../database';

export const handlerGetAllUsers = async (
  res: http.ServerResponse
): Promise<void> => {
  try {
    const users = await dataBase.getUsers();
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
      const user: IUser | undefined = await dataBase.getUserById(userId);
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
  let body = '';
  req
    .on('data', (chunk) => {
      body += chunk;
    })
    .on('end', async () => {
      const isCorrectFormat = await checkDataFormat(body);

      if (!isCorrectFormat) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: `Error, data is in correct JSON format ${body}`,
          })
        );
        return;
      }

      const data = await JSON.parse(body);
      if (data !== undefined && typeof data === 'object') {
        const errors = validateCreateUser(data);
        if (errors.length === 0) {
          const newUser = await dataBase.createUser(data);

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
  userId: string | undefined
): Promise<void> => {
  try {
    if (userId && uuidValidate(userId)) {
      const user = await dataBase.getUserById(userId);

      if (user) {
        let body = '';
        req
          .on('data', (chunk) => {
            body += chunk;
          })
          .on('end', async () => {
            const isCorrectFormat = await checkDataFormat(body);
            if (!isCorrectFormat) {
              res.statusCode = 400;
              res.end(
                JSON.stringify({
                  message: `Error, data is in correct JSON format ${body}`,
                })
              );
              return;
            }

            const dataToReplace: IUserCreate =
              body.length > 0 ? await JSON.parse(body) : {};

            const errors = validateUpdateUser(dataToReplace);

            if (errors.length === 0) {
              const updatedUser = getUpdatedUsers(user, dataToReplace);

              await dataBase.modifyUser(updatedUser);

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
  res: http.ServerResponse,
  userId: string | undefined
): Promise<void> => {
  try {
    if (userId && uuidValidate(userId)) {
      const isDeleteSuccess: boolean = await dataBase.deleteUser(userId);

      if (isDeleteSuccess) {
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
