import { mouse, left, right, up, down } from '@nut-tree/nut-js';

const moveMouse = async (direction: string, distance: number) => {
  switch (direction) {
    case 'up': {
      await mouse.move(up(distance));
      break;
    }
    case 'down': {
      await mouse.move(down(distance));
      break;
    }
    case 'left': {
      await mouse.move(left(distance));
      break;
    }
    case 'right': {
      await mouse.move(right(distance));
      break;
    }
    default:
      break;
  }
};

export default moveMouse;
