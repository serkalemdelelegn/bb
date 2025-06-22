import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  role: {name: string};
  iat: number;
  exp: number;
}

interface AuthState {
  token: string | null;
  role: string | null;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  setToken: (token) => {
    const decoded: DecodedToken = jwtDecode(token);
    set({ token, role: decoded.role.name });
    localStorage.setItem("token", token);
  },
  clearAuth: () => {
    set({ token: null, role: null });
    localStorage.removeItem("token");
  },
}));