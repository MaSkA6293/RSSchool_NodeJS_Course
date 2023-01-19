import { readFile, rm } from 'fs/promises';
import { screen, Region, mouse, FileType } from '@nut-tree/nut-js';

const pathToFileDestination = './src/ws_server';
const filePath = `${pathToFileDestination}/image.png`;

const checkBoundaryValue = (value: number, max: number) => {
  if (value - 100 < 0) return 0;

  if (value + 100 > max) return max - 200;

  return value - 100;
};

const getCoordinates = (
  mouseX: number,
  mouseY: number,
  height: number,
  width: number
): number[] => {
  const x = checkBoundaryValue(mouseX, width);
  const y = checkBoundaryValue(mouseY, height);
  return [x, y];
};

const getPrintScreen = async (): Promise<string> => {
  const mousePosition = await mouse.getPosition();

  const [screenHeight, screenWidth] = await Promise.all([
    screen.height(),
    screen.width(),
  ]);

  const [x, y] = getCoordinates(
    mousePosition.x,
    mousePosition.y,
    screenHeight,
    screenWidth
  );

  await screen.captureRegion(
    'image',
    new Region(x, y, 200, 200),
    FileType.PNG,
    pathToFileDestination
  );

  const read = await readFile(filePath);

  await rm(filePath);

  return Buffer.from(read).toString('base64');
};

export default getPrintScreen;
