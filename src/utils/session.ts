import type { IUser, Role, ISessionPayload } from "../types/auth";

const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 hours

export const createSessionToken = (user: IUser): string => {
  const payload: ISessionPayload = {
    userId: user.id,
    role: user.role as Role,
    name: user.name,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
};

export const decodeSessionToken = (
  token: string | null | undefined
): ISessionPayload | null => {
  if (!token) return null;
  try {
    const raw = decodeURIComponent(escape(atob(token)));
    const payload = JSON.parse(raw) as ISessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
};

export const tokenToUser = (token: string | null | undefined): IUser | null => {
  const payload = decodeSessionToken(token);
  if (!payload) return null;
  return {
    id: payload.userId,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };
};

export const isTokenValid = (
  token: string | null | undefined
): boolean => !!decodeSessionToken(token);

export const isAdminToken = (
  token: string | null | undefined
): boolean => decodeSessionToken(token)?.role === "admin";
