const BASE_URL = import.meta.env.VITE_API_URL || "";

export function getBaseUrl(): string {
  return BASE_URL.replace(/\/$/, "");
}

export async function request<T>(
  endpoint: string,
  options: RequestInit & { body?: unknown } = {}
): Promise<T> {
  const url = getBaseUrl() ? `${getBaseUrl()}${endpoint}` : "";
  
  if (!url) {
    const errorMsg = "VITE_API_URL is not set. Backend features require a configured API URL.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  console.log("Making request to:", url);
  
  const { body, ...rest } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const token = typeof window !== "undefined" ? localStorage.getItem("medisense_token") : null;
  if (token) {
    (headers as Record<string, string>)["Authorization"] = "Bearer " + token;
  }
  
  console.log("Request details:", { url, method: options.method || "GET", headers: { ...headers, Authorization: token ? "Bearer [REDACTED]" : undefined }, body: body ? "[PRESENT]" : "[NONE]" });
  
  const res = await fetch(url, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : options.body,
  });
  
  console.log("Response status:", res.status, "URL:", url);
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    console.error("Request failed:", err);
    throw new Error((err as { message?: string }).message || "Request failed");
  }
  return res.json().catch(() => ({} as T));
}

export function isBackendConfigured(): boolean {
  return Boolean(getBaseUrl());
}
