import { WebSocketServer, createWebSocketStream } from 'ws';
import * as dotenv from 'dotenv';
import { EOL } from 'os';
import messageHandler from '../utils/messageHandler';
import httpServer from '../http_server/index';

dotenv.config();

const WS_PORT = 8080;

const HTTP_PORT = 8181;

process.stdout.write(
  `\x1b[36mhttp server started on http://localhost:${HTTP_PORT}${EOL}`
);

httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });

wss.on('listening', () =>
  process.stdout.write(
    `\x1b[36mWS server started on http://localhost:${WS_PORT}${EOL}`
  )
);

wss.on('headers', (data) => {
  process.stdout.write(`\x1b[91mweb socket started ${EOL}`);
  data.forEach((element: string) => {
    process.stdout.write(`\x1b[33m${element} ${EOL}`);
  });
});

wss.on('connection', (ws) => {
  try {
    const duplex = createWebSocketStream(ws, {
      encoding: 'utf8',
      decodeStrings: false,
    });

    duplex.on('readable', async () => {
      let data = '';
      let chunk = '';
      while (chunk !== null) {
        data += chunk;
        chunk = duplex.read();
      }

      process.stdout.write(`\x1b[34mWS received the command ${data} ${EOL}`);
      const message = await messageHandler(data, duplex);
      process.stdout.write(`\x1b[96mWS send the command ${message} ${EOL}`);
    });

    ws.on('close', () => {
      process.stdout.write(`\x1b[91mwebsocket closed ${EOL} ${EOL}`);
      duplex.destroy();
    });
  } catch {
    process.stdout.write('Server error');
  }
});

process.on('SIGINT', () => {
  process.stdout.write(`\x1b[37m`);
  process.exit();
});
