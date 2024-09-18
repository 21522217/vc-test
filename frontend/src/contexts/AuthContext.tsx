import React, { createContext, useState, ReactNode } from "react";

interface AuthState {
  token: string;
}

interface AuthContextType {
  auth: AuthState | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {
    auth: null,
    login: () => {},
    logout: () => {},
    isAuthenticated: () => false
  }
);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const token = localStorage.getItem("token");
    return token ? { token } : null;
  });

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setAuth({ token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(null);
  };

  const isAuthenticated = () => !!auth?.token;

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
