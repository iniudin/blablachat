import { User } from "@/types/user";
import { createContext } from "react";

export const AuthContext = createContext<{
  user: User | null;
  login: (name: string, password: string) => Promise<void>;
  register: (name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
} | null>(null);
