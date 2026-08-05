import { demoUsers } from "../data/data";
import { registeredUsersKey } from "../constant/storageKey";
import type {
  ILoginPayload,
  IRegisterPayload,
  IUser,
} from "../types/auth";
import { getStoredJson, setStoredJson } from "../utils/local-storage";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const simulateLatency = (ms = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getRegisteredUsers = (): IUser[] =>
  getStoredJson<IUser[]>(registeredUsersKey, []);

const saveRegisteredUser = (user: IUser): void => {
  setStoredJson(registeredUsersKey, [...getRegisteredUsers(), user]);
};

export const login = async (payload: ILoginPayload): Promise<IUser> => {
  await simulateLatency();
  const email = payload.email.trim().toLowerCase();
  const user = demoUsers.find(
    (u) => u.email.toLowerCase() === email && u.password === payload.password
  );
  if (!user) {
    throw new Error("Invalid email or password. Try the demo accounts below.");
  }
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

export const register = async (payload: IRegisterPayload): Promise<IUser> => {
  await simulateLatency();
  const name = payload.name.trim();
  const email = payload.email.trim().toLowerCase();

  if (name.length < 2) {
    throw new Error("Name must be at least 2 characters long.");
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
  if (payload.password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const exists = [...demoUsers, ...getRegisteredUsers()].some(
    (u) => u.email.toLowerCase() === email
  );
  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  const newUser: IUser = {
    id: `u-${Date.now()}`,
    name,
    email,
    role: "user",
  };
  saveRegisteredUser(newUser);
  return newUser;
};
