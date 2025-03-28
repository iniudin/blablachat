import type { User } from "~/types";

export const useAuthStore = defineStore("auth", () => {
  const user = useState<User | null>("user", () => null);
  const token = useState<string | null>("token", () => null);

  if (import.meta.client) {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    try {
      user.value = storedUser ? JSON.parse(storedUser) : null;
      token.value = storedToken || null;
    } catch (error) {
      console.log(error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      user.value = null;
      token.value = null;
    }
  }

  const isLoggedIn = computed(() => !!user.value && !!token.value);

  function login(newUser: User, newToken: string) {
    user.value = newUser;
    token.value = newToken;

    if (import.meta.client) {
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", newToken);
    }
  }

  function logout() {
    user.value = null;
    token.value = null;

    if (import.meta.client) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }

  return { user, token, isLoggedIn, login, logout };
});
