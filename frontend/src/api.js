export const API_BASE = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export function backendUrl(path = "") {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function request(path, options = {}) {
  const response = await fetch(backendUrl(path), {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed. Please try again.");
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
};

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem("kssSession") || localStorage.getItem("kssSession") || "null");
  } catch {
    return null;
  }
}

export function saveSession(user) {
  sessionStorage.setItem("kssSession", JSON.stringify(user));
  localStorage.setItem("kssSession", JSON.stringify(user));
}

export function clearSession() {
  sessionStorage.removeItem("kssSession");
  localStorage.removeItem("kssSession");
  localStorage.removeItem("kssBootstrap");
}

export function fileToPayload(file) {
  return new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error(`${file.name} is larger than 5MB.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, size: file.size, data: reader.result });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
