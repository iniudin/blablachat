import client from "./client";

const login = async (name: string, password: string) => {
  const response = await client.post("/api/login", { name, password });
  localStorage.setItem("token", response.data.user.auth_token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  return response.data;
};

const logout = async () => {
  const response = await client.delete("/api/logout");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return response.data;
};

const register = async (name: string, password: string) => {
  const response = await client.post("/api/register", { name, password });
  localStorage.setItem("token", response.data.user.auth_token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  return response.data;
};

const getCurrentUser = async () => {
  return localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;
};

export default {
  login,
  logout,
  register,
  getCurrentUser,
};
