import { mouse } from '@nut-tree/nut-js';

const getMouseCoordinates = async () => {
  const { x, y } = await mouse.getPosition();
  return { x, y };
};

export default getMouseCoordinates;
