import { Duplex } from 'stream';
import * as utils from './index';

const messageHandler = async (
  data: string,
  duplex: Duplex
): Promise<string | undefined> => {
  const [command, widthOrRadius, length] = data.toString().split(' ');

  if (command.startsWith('mouse_position')) {
    const { x, y } = await utils.getMouseCoordinates();
    const message = `mouse_position ${x},${y}`;
    duplex.write(message);
    return message;
  }

  if (command.startsWith('mouse')) {
    utils.moveMouse(command.slice(6), Number(widthOrRadius));
    const message = `${data} px`;
    duplex.write(message);
    return message;
  }

  if (command === 'prnt_scrn') {
    const image = await utils.getPrintScreen();
    const message = `prnt_scrn ${image}`;
    duplex.write(message);
    return message;
  }

  if (command.startsWith('draw')) {
    utils.drawMouse(command.slice(5), Number(widthOrRadius), Number(length));
    duplex.write(data);
    return data;
  }
  return undefined;
};
export default messageHandler;
