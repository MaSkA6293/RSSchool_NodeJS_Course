import http from 'http';
import url from 'url';
import { getUserId } from '../helpers';
import * as handlers from './handlers';
import Db from '../database/database';

const router = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  db: Db
) => {
  const requestUrl = req.url ? req.url : '';

  const { path } = url.parse(requestUrl, true);

  const userId: string | undefined = getUserId(path);

  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'GET' && path === '/api/users') {
      handlers.handlerGetAllUsers(res, db);
      return;
    }
    if (req.method === 'GET' && path === `/api/users/${userId}`) {
      handlers.handlerGetUserById(res, userId, db);
      return;
    }
    if (req.method === 'GET' && path === `/api/throwError`) {
      throw new Error();
    }
    if (req.method === 'POST' && path === `/api/users`) {
      handlers.handlerCreateUser(req, res, db);
      return;
    }
    if (req.method === 'PUT' && path === `/api/users/${userId}`) {
      handlers.handlerUpdateUser(req, res, userId, db);
      return;
    }
    if (req.method === 'DELETE' && path === `/api/users/${userId}`) {
      handlers.handlerDeleteUser(req, res, userId, db);
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ message: `Non-existing endpoint ${path}` }));
  } catch {
    handlers.handlerServerError(res);
  }
};

export default router;
