import { fileURLToPath } from 'url';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { IUserCreate, IFieldCreateUser, IUser } from './types';

const pathToDb = path.join(__dirname, './database/db.json');

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

export const validateUpdateUser = (body: IUserCreate): string[] => {
  let errors: string[] = [];

  const keys = Object.keys(body);

  for (let i = 0; i < keys.length; i += 1) {
    const fieldToCheck = fields.find((el) => el.name === keys[i]);
    if (fieldToCheck) {
      const checkResult = checkField(body, fieldToCheck, keys);
      if (checkResult) {
        errors = [...errors, checkResult];
      }
    } else {
      errors = [...errors, `The key: ${keys[i]} is incorrect`];
    }
  }

  return errors;
};

export const getUsers = async (): Promise<IUser[]> => {
  const db = await readFile(pathToDb, 'utf-8');
  const { users }: { users: IUser[] } = await JSON.parse(db);
  return users;
};

export const getUpdatedUsers = (
  user: IUser,
  dataToReplace: IUserCreate,
  users: IUser[]
): { updatedUser: IUser; updatedUsers: IUser[] } => {
  const updatedUser = { ...user };

  Object.keys(dataToReplace).forEach((key) => {
    updatedUser[key] = dataToReplace[key];
  });

  const updatedUsers = users.map((el) => {
    if (el.id === updatedUser.id) {
      return updatedUser;
    }
    return el;
  });

  return { updatedUser, updatedUsers };
};

export const updateBd = async (data: { users: IUser[] }) => {
  await writeFile(pathToDb, JSON.stringify(data));
};
