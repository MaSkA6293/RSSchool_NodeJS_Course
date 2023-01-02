import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import { EOL } from 'os';
import * as utils from '../utils';

dotenv.config();

const port = process.env.PORT ? process.env.PORT : 8080;

const wss = new WebSocketServer({ port: Number(port) });

wss.on('listening', () =>
  process.stdout.write(`\x1b[36mWS server started on port ${port}${EOL}`)
);

wss.on('headers', (data) => {
  process.stdout.write(`\x1b[91mweb socket started ${EOL}`);
  data.forEach((element) => {
    process.stdout.write(`\x1b[33m${element} ${EOL}`);
  });
});

wss.on('connection', (ws) => {
  ws.on('message', async (data: string) => {
    const [command, widthOrRadius, length] = data.toString().split(' ');

    utils.printCommand(command, widthOrRadius, length);

    if (command.startsWith('mouse')) {
      utils.moveMouse(command.slice(6), Number(widthOrRadius));
    }
    if (command === 'prnt_scrn') {
      const image = await utils.getPrintScreen();
      utils.printResult(image);
      ws.send(image);
    }
    if (command.startsWith('draw')) {
      utils.drawMouse(command.slice(5), Number(widthOrRadius), Number(length));
    }
    if (command.startsWith('mouse_position')) {
      const coordinates = await utils.getMouseCoordinates();
      utils.printResult(coordinates);
      ws.send(coordinates);
    }
  });

  ws.on('close', () => {
    process.stdout.write(`\x1b[91m websocket closed ${EOL} ${EOL}`);
    ws.close();
  });
});

process.on('SIGINT', () => {
  process.stdout.write(`\x1b[37m`);
  process.exit();
});
