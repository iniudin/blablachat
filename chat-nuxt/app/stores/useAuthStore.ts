import type { User } from "~/types";

export const useAuthStore = defineStore("auth", () => {
  const userState = useState<User | null>("user", () => null);
  const tokenState = useState<string | null>("token", () => null);

  if (import.meta.client) {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    try {
      userState.value = storedUser ? JSON.parse(storedUser) : null;
      tokenState.value = storedToken || null;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      userState.value = null;
      tokenState.value = null;
    }
  }

  const isLoggedIn = computed(() => !!userState.value && !!tokenState.value);

  async function loginUser(name: string, password: string) {
    try {
      const { user, token } = await useApiFetch<{ user: User; token: string }>("/api/login", {
        method: "POST",
        body: { name, password },
      });

      if (user) {
        userState.value = user;
        tokenState.value = token;

        if (import.meta.client) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async function registerUser(name: string, password: string) {
    try {
      const { user, token } = await useApiFetch<{ user: User; token: string }>("/api/register", {
        method: "POST",
        body: { name, password },
      });

      if (user) {
        userState.value = user;
        tokenState.value = token;

        if (import.meta.client) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async function logoutUser() {
    try {
      await useApiFetch("/api/logout", {
        method: "DELETE",
      });

      userState.value = null;
      tokenState.value = null;

      if (import.meta.client) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }

  return {
    user: userState,
    token: tokenState,
    isLoggedIn,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
  };
});
