// import { LoginResponse, loginUser } from "lib/api";
import { LoginResponse } from "@/interfaces/api/ListsOfApiInterface";
import { loginUser } from "lib/api";
import { createContext, useContext, useEffect, useState } from "react";

interface UserProfile {
  username: string;
}
interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
  const savedToken = sessionStorage.getItem("token");
  const u = sessionStorage.getItem("user");

  if (savedToken) {
    setToken(savedToken);
  }

  try {
    if (u) {
      setUser(JSON.parse(u));
    }
  } catch (e) {
    console.error("Error parsing stored user:", e);
  } finally {
    setLoading(false);
  }
}, []);


const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { token: newToken, username: returnedUsername }: LoginResponse =
        await loginUser(username, password);

      // persist
      sessionStorage.setItem("token", newToken);
      sessionStorage.setItem("user", JSON.stringify({ username: returnedUsername }));

      // update state
      setToken(newToken);
      setUser({ username: returnedUsername });
    } finally {
      setLoading(false);
    }
  };


const logout = () => {
  sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  setToken(null);
  setUser(null);
};


  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, login, logout, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
