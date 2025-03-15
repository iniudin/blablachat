import axios from "axios";

const BASE_URL = "http://localhost:3000";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email: string, password: string) => {
  const response = await client.post("/login", { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await client.delete("/logout");
  return response.data;
};
