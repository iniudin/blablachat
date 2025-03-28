import type { User } from "~/types";

export const useAuthStore = defineStore("auth", () => {
  const user = useState<User | null>("user", () => null);
  const token = useState<string | null>("token", () => null);

  user.value = JSON.parse(localStorage.getItem("user") || "null");
  token.value = localStorage.getItem("token");

  const isLoggedIn = computed(() => !!user.value && !!token.value);

  function login(newUser: User, newToken: string) {
    user.value = newUser;
    token.value = newToken;

    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", newToken);
  }

  function logout() {
    user.value = null;
    token.value = null;

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return { user, token, isLoggedIn, login, logout };
});
