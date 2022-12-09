import http from 'http';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { IUser, IUserCreate } from '../types';
import {
  validateCreateUser,
  validateUpdateUser,
  getUsers,
  getUpdatedUsers,
  updateBd,
} from '../helpers';

export const handlerGetAllUsers = async (
  res: http.ServerResponse
): Promise<void> => {
  try {
    const users = await getUsers();
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
      const users = await getUsers();

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

          const users: IUser[] = await getUsers();

          await updateBd({ users: [...users, newUser] });

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
      const users: IUser[] = await getUsers();

      const user: IUser | undefined = users.find((el) => el.id === userId);

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
              const { updatedUser, updatedUsers } = getUpdatedUsers(
                user,
                dataToReplace,
                users
              );

              await updateBd({ users: updatedUsers });

              res.statusCode = 201;
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
