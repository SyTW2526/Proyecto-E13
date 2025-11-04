// client/src/lib/api.ts
import axios from "axios";

// Por defecto, ruta relativa. Evita fijar puerto explícito.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

export function setAuthToken(token?: string) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
}

const existing = localStorage.getItem("token");
if (existing) setAuthToken(existing);
