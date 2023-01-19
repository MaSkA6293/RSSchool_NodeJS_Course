const printCommand = (
  command: string,
  widthOrRadius?: string,
  length?: string
) =>
  `${command} ${widthOrRadius !== undefined ? widthOrRadius : ''} ${
    length !== undefined ? length : ''
  }`;

export default printCommand;
