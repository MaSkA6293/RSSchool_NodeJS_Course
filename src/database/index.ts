import { v4 as uuidv4 } from 'uuid';
import cluster from 'cluster';
import { IUser, IUserCreate } from '../types';
import {
  workerCreateUser,
  getAllUsersFromParent,
  workerGetUserById,
  workerDeleteUser,
  workerModifyUser,
} from '../helpers';

class Db {
  users: IUser[] | [];

  constructor() {
    this.users = [];
  }

  getUsers = async (): Promise<IUser[]> => {
    if (cluster.isPrimary) return this.users;

    const users: IUser[] = await getAllUsersFromParent();

    return users;
  };

  setActualUsers = (users: IUser[]) => {
    this.users = users;
  };

  getUserById = async (userId: string): Promise<IUser | undefined> => {
    if (!cluster.isPrimary) {
      const newUser: IUser | undefined = await workerGetUserById(userId);

      return newUser;
    }
    return this.users.find((el) => el.id === userId);
  };

  createUser = async (data: IUserCreate): Promise<IUser> => {
    if (!cluster.isPrimary) {
      const newUser = await workerCreateUser(data);
      return newUser;
    }
    const newUser = { ...data, id: uuidv4() };
    this.users = [...this.users, newUser];

    return newUser;
  };

  modifyUser = async (updatedUser: IUser) => {
    if (cluster.isPrimary) {
      this.users = this.users.map((el) =>
        el.id === updatedUser.id ? updatedUser : el
      );
      return;
    }

    await workerModifyUser(updatedUser);
  };

  deleteUser = async (userId: string): Promise<boolean> => {
    if (!cluster.isPrimary) {
      const isSuccess = await workerDeleteUser(userId);
      return isSuccess;
    }

    const isExist = this.users.find((item) => item.id === userId);
    if (isExist) {
      this.users = this.users.filter((el) => el.id !== userId);
      return true;
    }
    return false;
  };

  addUser = (user: IUser) => {
    this.users = [...this.users, user];
  };
}

const dataBase = new Db();

export default dataBase;
