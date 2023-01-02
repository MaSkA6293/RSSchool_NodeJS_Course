import { WebSocketServer, createWebSocketStream } from 'ws';
import * as dotenv from 'dotenv';
import { EOL } from 'os';
import messageHandler from '../utils/messageHandler';

dotenv.config();

const port = process.env.PORT ? process.env.PORT : 8080;

const wss = new WebSocketServer({ port: Number(port) });

wss.on('listening', () =>
  process.stdout.write(`\x1b[36mWS server started on port ${port}${EOL}`)
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

      await messageHandler(data, duplex);
    });

    ws.on('close', () => {
      process.stdout.write(`\x1b[91m websocket closed ${EOL} ${EOL}`);
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
