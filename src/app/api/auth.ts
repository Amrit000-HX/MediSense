import { request, isBackendConfigured } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

const STORAGE_TOKEN = "medisense_token";
const STORAGE_USER = "medisense_user";

export function getStoredToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(STORAGE_TOKEN) : null;
}

export function getStoredUser(): { id: string; name: string; email: string } | null {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_USER) : null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredAuth(token: string, user: { id: string; name: string; email: string }): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_TOKEN, token);
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_TOKEN);
  localStorage.removeItem(STORAGE_USER);
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  if (!isBackendConfigured()) {
    return mockLogin(payload);
  }
  const data = await request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
  setStoredAuth(data.token, data.user);
  return data;
}

export async function signup(payload: SignUpPayload): Promise<AuthResponse> {
  if (!isBackendConfigured()) {
    return mockSignup(payload);
  }
  const data = await request<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: payload,
  });
  setStoredAuth(data.token, data.user);
  return data;
}

export function logout(): void {
  clearAuth();
}

function mockLogin(payload: LoginPayload): Promise<AuthResponse> {
  return Promise.resolve({
    token: "mock-token-" + Date.now(),
    user: { id: "1", name: "User", email: payload.email },
  });
}

function mockSignup(payload: SignUpPayload): Promise<AuthResponse> {
  return Promise.resolve({
    token: "mock-token-" + Date.now(),
    user: { id: "1", name: payload.name, email: payload.email },
  });
}
