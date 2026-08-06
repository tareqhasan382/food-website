import { jwtDecode } from "jwt-decode";
import { isAdminRole, Role } from "../types/auth";
import type { ISessionPayload } from "../types/auth";

export const decodeSessionToken = (
  token: string | null | undefined
): ISessionPayload | null => {
  if (!token) return null;
  try {
    const payload = jwtDecode<ISessionPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
};

export const isTokenValid = (
  token: string | null | undefined
): boolean => !!decodeSessionToken(token);

export const isAdminToken = (
  token: string | null | undefined
): boolean => isAdminRole(decodeSessionToken(token)?.role as Role | undefined);

export const getTokenRole = (
  token: string | null | undefined
): Role | null => decodeSessionToken(token)?.role ?? null;
