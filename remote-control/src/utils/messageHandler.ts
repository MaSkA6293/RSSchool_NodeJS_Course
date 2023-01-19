import { Duplex } from 'stream';
import * as utils from './index';

const messageHandler = async (data: string, duplex: Duplex): Promise<void> => {
  const [command, widthOrRadius, length] = data.toString().split(' ');

  if (command.startsWith('mouse_position')) {
    const { x, y } = await utils.getMouseCoordinates();
    duplex.write(`mouse_position ${x},${y}`);
    return;
  }

  if (command.startsWith('mouse')) {
    utils.moveMouse(command.slice(6), Number(widthOrRadius));
    duplex.write(`${data} px`);
    return;
  }

  if (command === 'prnt_scrn') {
    const image = await utils.getPrintScreen();
    duplex.write(`prnt_scrn ${image}`);
    return;
  }

  if (command.startsWith('draw')) {
    utils.drawMouse(command.slice(5), Number(widthOrRadius), Number(length));
    duplex.write(data);
  }
};
export default messageHandler;
