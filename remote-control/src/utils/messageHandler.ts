import { Duplex } from 'stream';
import * as utils from './index';

const messageHandler = async (data: string, duplex: Duplex): Promise<void> => {
  const [command, widthOrRadius, length] = data.toString().split(' ');

  utils.printCommand(command, widthOrRadius, length);

  if (command.startsWith('mouse')) {
    utils.moveMouse(command.slice(6), Number(widthOrRadius));
  }
  if (command === 'prnt_scrn') {
    const image = await utils.getPrintScreen();
    utils.printResult(image);
    duplex.write(image);
  }
  if (command.startsWith('draw')) {
    utils.drawMouse(command.slice(5), Number(widthOrRadius), Number(length));
  }
  if (command.startsWith('mouse_position')) {
    const coordinates = await utils.getMouseCoordinates();
    utils.printResult(coordinates);
    duplex.write(coordinates);
  }
};
export default messageHandler;
