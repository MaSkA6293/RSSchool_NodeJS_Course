export interface IUser {
  [key: string]: number | string | string[];
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface IUserCreate {
  [key: string]: number | string | string[];
  username: string;
  age: number;
  hobbies: string[];
}

export interface IFieldCreateUser {
  name: string;
  type: string;
  errorRequired: string;
  errorType: string;
}
