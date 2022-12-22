import { EOL } from 'os';
import httpServer from './src/http_server/index';

const HTTP_PORT = 8181;

process.stdout.write(
  `Start static http server on the ${HTTP_PORT} port!${EOL}`
);

httpServer.listen(HTTP_PORT);
