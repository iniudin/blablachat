import { User } from "@/types/user";
import { createContext, useEffect, useState } from "react";
import authApi from "@/api/auth";

const AuthContext = createContext<{
  user: User | null;
  login: (name: string, password: string) => Promise<void>;
  register: (name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = authApi.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = async (name: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const user = await authApi.login(name, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "failed to login");
      } else {
        setError("failed to login");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const user = await authApi.register(name, password);
      setCurrentUser(user);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "failed to register");
      } else {
        setError("failed to register");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      setCurrentUser(null);
      await authApi.logout();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "failed to logout");
      } else {
        setError("failed to logout");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        login,
        register,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
