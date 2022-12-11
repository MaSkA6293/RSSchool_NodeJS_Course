import { v4 as uuidv4 } from 'uuid';
import { IUser, IUserCreate } from '../types';

class Db {
  users: IUser[] | [];

  constructor() {
    this.users = [];
  }

  getUsers = () => this.users;

  getUserById = (userId: string) => this.users.find((el) => el.id === userId);

  createUser = (data: IUserCreate): IUser => {
    const newUser = { ...data, id: uuidv4() };

    this.users = [...this.users, newUser];

    return newUser;
  };

  modifyUser = (updatedUser: IUser) => {
    this.users = this.users.map((el) =>
      el.id === updatedUser.id ? updatedUser : el
    );
  };

  deleteUser = (userId: string) => {
    this.users = this.users.filter((el) => el.id !== userId);
  };
}

export default Db;
