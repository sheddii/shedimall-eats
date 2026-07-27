import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");

export type AuthUser = {
  id?: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  token?: string;
};

type AuthCtx = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const STORAGE_KEY = "shedimall.auth";

export function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = readStoredUser();
    if (storedUser?.token) {
      fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Session expired");
          return res.json();
        })
        .then((data) => {
          // /api/auth/me returns { user: { id, name, email, role, ... } }
          const u = data.user ?? data;
          persist({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            token: storedUser.token,
          });
        })
        .catch(() => {
          // Token is invalid/expired — clear the stale session
          persist(null);
        });
    }
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    try {
      if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const signIn: AuthCtx["signIn"] = async (email, password) => {
    if (!email.trim() || !password.trim()) throw new Error("Email and password are required");

    const res = await fetch(`${API_BASE}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || errData.error || "Authentication failed");
    }

    const data = await res.json();
    persist({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      token: data.token,
    });
  };

  const signUp: AuthCtx["signUp"] = async (name, email, password) => {
    if (!name.trim() || !email.trim() || !password.trim()) throw new Error("All fields are required");

    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || errData.error || "Registration failed");
    }

    const data = await res.json();
    persist({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      token: data.token,
    });
  };

  const signOut = () => persist(null);

  const isAdmin = user?.role === "admin";

  return (
    <Ctx.Provider value={{ user, isAuthenticated: !!user, isAdmin, signIn, signUp, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
