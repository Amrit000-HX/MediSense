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
<<<<<<< HEAD
  return typeof window !== "undefined" ? localStorage.getItem(STORAGE_TOKEN) : null;
=======
  const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_TOKEN) : null;
  console.log("getStoredToken - Token:", token ? "[PRESENT]" : "[MISSING]");
  return token;
>>>>>>> local-changes
}

export function getStoredUser(): { id: string; name: string; email: string } | null {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_USER) : null;
<<<<<<< HEAD
    return raw ? JSON.parse(raw) : null;
  } catch {
=======
    const user = raw ? JSON.parse(raw) : null;
    console.log("getStoredUser - User:", user ? "[PRESENT]" : "[MISSING]", user);
    return user;
  } catch (error) {
    console.error("Error parsing stored user:", error);
>>>>>>> local-changes
    return null;
  }
}

function setStoredAuth(token: string, user: { id: string; name: string; email: string }): void {
<<<<<<< HEAD
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_TOKEN, token);
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
=======
  console.log("setStoredAuth - Storing auth:", { token: token ? "[PRESENT]" : "[MISSING]", user });
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_TOKEN, token);
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
  console.log("setStoredAuth - Auth stored successfully");
>>>>>>> local-changes
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_TOKEN);
  localStorage.removeItem(STORAGE_USER);
}

<<<<<<< HEAD
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  if (!isBackendConfigured()) {
    return mockLogin(payload);
=======
export async function sendLoginOTP(email: string): Promise<{ success: boolean; message: string }> {
  console.log("Attempting to send login OTP for:", email);
  
  if (!isBackendConfigured()) {
    console.log("Backend not configured, cannot send OTP");
    return { success: false, message: "Backend not configured. Please set up server connection." };
  }
  
  try {
    console.log("Sending OTP to backend...");
    const result = await request<{ success: boolean; message: string }>("/api/auth/send-login-otp", {
      method: "POST",
      body: { email },
    });
    console.log("Backend response:", result);
    return result;
  } catch (error) {
    console.error("Backend OTP sending failed:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to connect to backend" };
  }
}

export async function verifyLoginOTP(email: string, otp: string, password: string): Promise<AuthResponse> {
  console.log("Verifying login OTP for:", email);
  
  if (!isBackendConfigured()) {
    console.log("Backend not configured, cannot verify OTP");
    throw new Error("Backend not configured. Please set up server connection.");
  }
  
  try {
    console.log("Sending OTP verification to backend...");
    const data = await request<AuthResponse>("/api/auth/verify-otp-login", {
      method: "POST",
      body: { email, otp, password },
    });
    console.log("Backend verification response:", data);
    setStoredAuth(data.token, data.user);
    return data;
  } catch (error) {
    console.error("Backend OTP verification failed:", error);
    throw error;
  }
}

export async function sendSignupOTP(email: string): Promise<{ success: boolean; message: string }> {
  console.log("Attempting to send signup OTP for:", email);
  
  if (!isBackendConfigured()) {
    console.log("Backend not configured, cannot send OTP");
    return { success: false, message: "Backend not configured. Please set up server connection." };
  }
  
  try {
    console.log("Sending OTP to backend...");
    const result = await request<{ success: boolean; message: string }>("/api/auth/send-signup-otp", {
      method: "POST",
      body: { email },
    });
    console.log("Backend response:", result);
    return result;
  } catch (error) {
    console.error("Backend OTP sending failed:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to connect to backend" };
  }
}

export async function verifySignupOTP(name: string, email: string, otp: string, password: string): Promise<AuthResponse> {
  console.log("Verifying signup OTP for:", email);
  
  if (!isBackendConfigured()) {
    console.log("Backend not configured, cannot verify OTP");
    throw new Error("Backend not configured. Please set up server connection.");
  }
  
  try {
    console.log("Sending OTP verification to backend...");
    const data = await request<AuthResponse>("/api/auth/verify-otp-signup", {
      method: "POST",
      body: { name, email, otp, password },
    });
    console.log("Backend verification response:", data);
    setStoredAuth(data.token, data.user);
    return data;
  } catch (error) {
    console.error("Backend OTP verification failed:", error);
    throw error;
  }
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  if (!isBackendConfigured()) {
    console.log("Backend not configured, cannot login");
    throw new Error("Backend not configured. Please set up server connection.");
>>>>>>> local-changes
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
<<<<<<< HEAD
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
=======
  const authData = {
    token: "mock-token-" + Date.now(),
    user: { id: "1", name: "User", email: payload.email },
  };
  setStoredAuth(authData.token, authData.user);
  return Promise.resolve(authData);
}

function mockSignup(payload: SignUpPayload): Promise<AuthResponse> {
  const authData = {
    token: "mock-token-" + Date.now(),
    user: { id: "1", name: payload.name, email: payload.email },
  };
  setStoredAuth(authData.token, authData.user);
  return Promise.resolve(authData);
>>>>>>> local-changes
}
