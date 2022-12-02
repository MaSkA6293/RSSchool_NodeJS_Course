import * as dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const server: http.Server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.end('hello user');
  }
);

server.listen(process.env.PORT, () => {
  process.stdout.write(`Server has been started on port:${process.env.PORT}`);
});
