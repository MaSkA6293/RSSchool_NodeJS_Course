export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface IUserCreate {
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
