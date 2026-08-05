import { authKey } from "../constant/storageKey";

const hasWindow = typeof window !== "undefined";

export const setToLocalStorage = (key: string, value: string): void => {
  if (!key || !hasWindow) return;
  window.localStorage.setItem(key, value);
};

export const getFromLocalStorage = (key: string): string | null => {
  if (!key || !hasWindow) return null;
  return window.localStorage.getItem(key);
};

export const removeUserInfo = (key: string): void => {
  if (!hasWindow) return;
  window.localStorage.removeItem(key);
};

export const isLoggedIn = (): boolean => !!getFromLocalStorage(authKey);

export const setAuthToken = (token: string): void =>
  setToLocalStorage(authKey, token);

export const getAuthToken = (): string | null => getFromLocalStorage(authKey);

export const clearAuth = (): void => removeUserInfo(authKey);

export const setStoredJson = <T>(key: string, value: T): void => {
  if (!hasWindow) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getStoredJson = <T>(key: string, fallback: T): T => {
  if (!hasWindow) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
