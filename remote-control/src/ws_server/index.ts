import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import { EOL } from 'os';
import * as utils from '../utils';

dotenv.config();

const port = process.env.PORT ? process.env.PORT : 8080;

const wss = new WebSocketServer({ port: Number(port) });

process.stdout.write(`WSS has been started on port ${port}${EOL}`);

wss.on('connection', (ws) => {
  ws.on('message', async (data: string) => {
    const [command, widthOrRadius, length] = data.toString().split(' ');
    if (command.startsWith('mouse')) {
      utils.moveMouse(command.slice(6), Number(widthOrRadius));
    }
    if (command === 'prnt_scrn') {
      const image = await utils.getPrintScreen();
      ws.send(image);
    }
    if (command.startsWith('draw')) {
      utils.drawMouse(command.slice(5), Number(widthOrRadius), Number(length));
    }
    if (command.startsWith('mouse_position')) {
      const coordinates = await utils.getMouseCoordinates();
      ws.send(coordinates);
    }
  });
});
