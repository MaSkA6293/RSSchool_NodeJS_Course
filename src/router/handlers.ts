import http from 'http';
import { validate as uuidValidate } from 'uuid';
import { IUser } from '../types';
import db from '../db';

export const handlerGetAllUsers = (res: http.ServerResponse): void => {
  res.statusCode = 200;
  res.end(JSON.stringify(db));
};

export const handlerGetUserById = (
  res: http.ServerResponse,
  userId: string | undefined
): void => {
  if (userId && uuidValidate(userId)) {
    const user: IUser | undefined = db.find((el) => el.id === userId);
    if (user) {
      res.statusCode = 200;
      res.end(JSON.stringify(user));
    } else {
      res.statusCode = 404;
      res.end(
        JSON.stringify({ message: `The user with id=${userId} doesn't exist` })
      );
    }
  } else {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: `userId is invalid id=${userId}` }));
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
