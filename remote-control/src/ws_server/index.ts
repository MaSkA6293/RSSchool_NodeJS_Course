import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import { EOL } from 'os';
import moveMouse from '../utils/moveMouse';
import getPrintScreen from '../utils/printScreen';

dotenv.config();

const port = process.env.PORT ? process.env.PORT : 8080;

const wss = new WebSocketServer({ port: Number(port) });

process.stdout.write(`WSS has been started on port ${port}${EOL}`);

wss.on('connection', (ws) => {
  ws.on('message', async (data: string) => {
    const [command, value] = data.toString().split(' ');

    if (command.startsWith('mouse')) {
      moveMouse(command.slice(6), Number(value));
    }
    if (command === 'prnt_scrn') {
      const image = await getPrintScreen();
      ws.send(image);
    }
  });
});
