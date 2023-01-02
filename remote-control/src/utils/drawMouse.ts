import { mouse, Point, screen } from '@nut-tree/nut-js';

import mouseMove from './moveMouse';

const drawRectangle = async (width: number, length: number): Promise<void> => {
  await mouseMove('right', length);
  await mouseMove('down', width);
  await mouseMove('left', length);
  await mouseMove('up', width);
};

const drawCircle = async (
  radius: number,
  screenWidth: number,
  screenHeight: number
) => {
  for (let i = 180; i > -180; i -= 0.03) {
    const x = radius * Math.sin((Math.PI * 2 * i) / 360);
    const y = radius * Math.cos((Math.PI * 2 * i) / 360);
    mouse.setPosition(new Point(x + screenWidth / 2, y + screenHeight / 2));
  }
  await mouse.setPosition(new Point(screenWidth / 2, screenHeight / 2));
};

const drawMouse = async (
  command: string,
  widthOrRadius: number,
  length: number
) => {
  const [screenHeight, screenWidth] = await Promise.all([
    screen.height(),
    screen.width(),
  ]);

  await mouse.setPosition(new Point(screenWidth / 2, screenHeight / 2));

  mouse.config.mouseSpeed = 500;

  await mouse.pressButton(0);

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
      await drawCircle(widthOrRadius, screenWidth, screenHeight);
      break;
    }
    default:
  }
  await mouse.releaseButton(0);
};

export default drawMouse;
