export type Role = "admin" | "user";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface IDemoUser extends IUser {
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ISessionPayload {
  userId: string;
  role: Role;
  name: string;
  email: string;
  exp: number;
}
