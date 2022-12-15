import * as dotenv from 'dotenv';
import http from 'http';
import router from './router/router';

dotenv.config();

const app: http.Server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    router(req, res);
  }
);

export default app;
