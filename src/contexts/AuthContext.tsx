import React, { createContext, useContext, useState, useEffect } from "react";
import { Usuario } from "@/types";

interface AuthContextType {
  user: Usuario | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    // Check localStorage for saved session
    const savedUser = localStorage.getItem("reduc_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validate UC email
    if (!email.endsWith("@uc.cl")) {
      return false;
    }

    // Mock login - in production, this would call an API
    const mockUser: Usuario = {
      id: "1",
      email,
      nombre: email.split("@")[0],
      isAdmin: email === "admin@uc.cl", // Admin account for demo
    };

    setUser(mockUser);
    localStorage.setItem("reduc_user", JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("reduc_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
