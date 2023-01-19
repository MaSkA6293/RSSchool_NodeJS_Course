import { mouse, Point } from '@nut-tree/nut-js';

import mouseMove from './moveMouse';

const drawRectangle = async (width: number, length: number): Promise<void> => {
  await mouse.pressButton(0);
  await mouseMove('right', length);
  await mouseMove('down', width);
  await mouseMove('left', length);
  await mouseMove('up', width);
};

const getNextPointCoordinates = (radius: number, i: number) => {
  const pointX = radius * Math.sin((Math.PI * 2 * i) / 360);
  const pointY = radius * Math.cos((Math.PI * 2 * i) / 360);
  return { pointX, pointY };
};

const drawCircle = async (radius: number) => {
  const { x, y } = await mouse.getPosition();

  const firstPoint = getNextPointCoordinates(radius, 180);

  mouse.setPosition(new Point(x + firstPoint.pointX, y + firstPoint.pointY));

  await mouse.pressButton(0);

  for (let i = 180; i > -180; i -= 0.05) {
    const coordinates = getNextPointCoordinates(radius, i);
    mouse.setPosition(
      new Point(x + coordinates.pointX, y + coordinates.pointY)
    );
  }
};

const drawMouse = async (
  command: string,
  widthOrRadius: number,
  length: number
) => {
  mouse.config.mouseSpeed = 300;

  switch (command) {
    case 'square': {
      await drawRectangle(widthOrRadius, widthOrRadius);
      break;
    }
    case 'rectangle': {
      await drawRectangle(widthOrRadius, length);
      break;
    }
    case 'circle': {
      await drawCircle(widthOrRadius);
      break;
    }
    default:
  }
  await mouse.releaseButton(0);
};

export default drawMouse;
