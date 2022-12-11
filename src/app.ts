import * as dotenv from 'dotenv';
import http from 'http';
import router from './router/router';
import Db from './database/database';

dotenv.config();

const db: Db = new Db();

const app: http.Server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    router(req, res, db);
  }
);

export default app;
