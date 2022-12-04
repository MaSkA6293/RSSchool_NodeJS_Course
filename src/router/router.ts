import http from 'http';
import url from 'url';
import getUserId from '../helpers';
import {
  handlerGetAllUsers,
  handlerGetUserById,
  handlerServerError,
} from './handlers';

const router = (req: http.IncomingMessage, res: http.ServerResponse) => {
  const requestUrl = req.url ? req.url : '';

  const { path } = url.parse(requestUrl, true);

  const userId: string | undefined = getUserId(path);

  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'GET' && path === '/api/users') {
      handlerGetAllUsers(res);
      return;
    }
    if (req.method === 'GET' && path === `/api/users/${userId}`) {
      handlerGetUserById(res, userId);
      return;
    }
    if (req.method === 'GET' && path === `/api/throwError`) {
      throw new Error();
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ message: `Non-existing endpoint ${path}` }));
  } catch {
    handlerServerError(res);
  }
};

export default router;
