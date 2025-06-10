import { loginUser } from "lib/api";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
  const savedToken = sessionStorage.getItem("token");
  if (savedToken) setToken(savedToken);
  setLoading(false);
}, []);

const login = async (username: string, password: string) => {
  const newToken = await loginUser(username, password);
  sessionStorage.setItem("token", newToken);
  setToken(newToken);
};

const logout = () => {
  sessionStorage.removeItem("token");
  setToken(null);
};


  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
