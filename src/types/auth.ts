export type Role = "admin" | "user" | "superAdmin";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified?: boolean;
  profileImg?: string;
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

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ISessionPayload {
  userId: string;
  role: Role;
  email: string;
  exp: number;
}

export interface IAuthResult {
  user: IUser;
  token: string;
}

export const isAdminRole = (role: Role | undefined): boolean =>
  role === "admin" || role === "superAdmin";
