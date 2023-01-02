import { EOL } from 'os';

export const printCommand = (
  command: string,
  widthOrRadius?: string,
  length?: string
) => {
  process.stdout.write(
    `\x1b[35mWSS received the following command: ${command} ${
      widthOrRadius !== undefined ? widthOrRadius : ''
    } ${length !== undefined ? length : ''}${EOL}`
  );
};

export const printResult = (command: string) => {
  process.stdout.write(
    `${EOL}\x1b[32mWSS sent the following command: ${EOL}${command} ${EOL}${EOL}`
  );
};
