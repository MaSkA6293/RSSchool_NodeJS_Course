import { screen, Region, mouse } from '@nut-tree/nut-js';
import Jimp from 'jimp';

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

  const screenShot = await screen.grabRegion(new Region(x, y, 200, 200));

  const screenShotRgb = await screenShot.toRGB();

  const jimpImage = new Jimp({ ...screenShotRgb });

  const base64buffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);

  return base64buffer.toString('base64');
};

export default getPrintScreen;
