import { fileURLToPath } from 'url';
import path from 'path';
import { IUserCreate, IFieldCreateUser } from './types';

export const getUserId = (queryString: string | null): string | undefined => {
  if (queryString) {
    return queryString.split('/').slice(-1)[0];
  }
  return undefined;
};

export const getDirName = (urlToPath: string) => {
  const filename = fileURLToPath(urlToPath);
  return path.dirname(filename);
};

const checkField = (
  body: IUserCreate,
  field: IFieldCreateUser,
  keys: string[]
): string => {
  const { name, type, errorRequired, errorType } = field;

  if (keys.includes(name)) {
    if (type === 'array') {
      const hobbies = body[name as keyof IUserCreate];
      if (!Array.isArray(hobbies)) {
        return `${name} : ${errorType}`;
      }
      if (Array.isArray(hobbies)) {
        const checkTypeElements = hobbies.every((el) => typeof el === 'string');
        return !checkTypeElements
          ? `${name} : ${errorType}. One of the elements has incorrect type`
          : '';
      }
    }

    if (typeof body[name as keyof IUserCreate] !== type) {
      return `${name} : ${errorType}`;
    }
    return '';
  }

  return `${name} : ${errorRequired}`;
};

export const validateCreateUser = (body: IUserCreate): string[] => {
  const fields: IFieldCreateUser[] = [
    {
      name: 'username',
      type: 'string',
      errorRequired: 'the field username is required',
      errorType: 'the field mast be of type string',
    },
    {
      name: 'age',
      type: 'number',
      errorRequired: 'the field age is required',
      errorType: 'the field mast be of type number',
    },
    {
      name: 'hobbies',
      type: 'array',
      errorRequired: 'the field hobbies is required',
      errorType: 'the field mast be of type string [], or empty []',
    },
  ];

  let errors: string[] = [];

  const keys = Object.keys(body);

  for (let i = 0; i < fields.length; i += 1) {
    const checkResult = checkField(body, fields[i], keys);
    if (checkResult) {
      errors = [...errors, checkResult];
    }
  }

  return errors;
};
