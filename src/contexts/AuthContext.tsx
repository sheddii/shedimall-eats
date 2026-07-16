import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = { name: string; email: string };

type AuthCtx = {
  user: AuthUser | null;
  isAuthenticated: boolean;
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
    setUser(readStoredUser());
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
    persist({ name: email.split("@")[0] || "Guest", email });
  };
  const signUp: AuthCtx["signUp"] = async (name, email, password) => {
    if (!name.trim() || !email.trim() || !password.trim()) throw new Error("All fields are required");
    persist({ name, email });
  };
  const signOut = () => persist(null);

  return (
    <Ctx.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
