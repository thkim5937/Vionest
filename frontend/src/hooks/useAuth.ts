import {
  createContext,
  createElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthUser, login as loginRequest, logout as logoutRequest, me, signup as signupRequest } from "../api/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    await signupRequest(email, password);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await loginRequest(email, password);
    const currentUser = await me();
    setUser(currentUser);
    return currentUser;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  // Re-fetches the session user — needed after actions (like profile creation) that
  // change server-side state useAuth wasn't the one to perform, so its cached user
  // would otherwise go stale (e.g. hasProfile staying false after a profile is created).
  const refreshUser = useCallback(async () => {
    const currentUser = await me();
    setUser(currentUser);
    return currentUser;
  }, []);

  return createElement(AuthContext.Provider, { value: { user, isLoading, signup, login, logout, refreshUser } }, children);
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
