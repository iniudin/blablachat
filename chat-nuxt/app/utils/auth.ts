import type { User } from "~/types";

const login = async (name: string, password: string) => {
  return await $fetch<{ user: User; token: string }>(
    "/api/login", { method: "POST", body: { name, password } },
  );
};

const logout = async () => {
  return await $fetch("/api/logout", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const register = async (name: string, password: string) => {
  return await $fetch<{ user: User; token: string }>(
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
