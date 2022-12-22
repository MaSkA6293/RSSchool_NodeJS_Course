import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import { EOL } from 'os';

dotenv.config();

const port = process.env.PORT ? process.env.PORT : 8080;

const wss = new WebSocketServer({ port: Number(port) });

process.stdout.write(`WSS has been started on port ${port}${EOL}`);

wss.on('connection', (ws) => {
  ws.on('message', (data: string) => {
    process.stdout.write(`received: %s ${data}`);
  });

  ws.send('something');
});
