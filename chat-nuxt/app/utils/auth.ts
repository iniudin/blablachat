import type { User } from "~/types";

const login = async (name: string, password: string) => {
  return await useApiFetch<{ user: User; token: string }>("/api/login", {
    method: "POST",
    body: { name, password },
  });
};

const logout = async () => {
  return await useApiFetch("/api/logout");
};

const register = async (name: string, password: string) => {
  return await useApiFetch<{ user: User; token: string }>(
    "/api/register", {
      method: "POST",
      body: { name, password },
    },
  );
};

export {
  login,
  logout,
  register,
};
