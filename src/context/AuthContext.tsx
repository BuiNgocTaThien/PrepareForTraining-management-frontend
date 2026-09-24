import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  login as loginApi,
  register as registerApi,
} from "../services/authService";
import type { User } from "../types/auth";
interface AuthValue {
  user: User | null;
  loading: boolean;
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string, fullName: string): Promise<User>;
  logout(): void;
}
const AuthContext = createContext<AuthValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      setLoading(false);
      return;
    }
    getCurrentUser()
      .then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem("accessToken"))
      .finally(() => setLoading(false));
  }, []);
  const save = (token: string, currentUser: User) => {
    localStorage.setItem("accessToken", token);
    setUser(currentUser);
    return currentUser;
  };
  const login = async (email: string, password: string) => {
    const r = await loginApi(email, password);
    return save(r.data.accessToken, r.data.user);
  };
  const register = async (
    email: string,
    password: string,
    fullName: string,
  ) => {
    const r = await registerApi(email, password, fullName);
    return save(r.data.accessToken, r.data.user);
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
