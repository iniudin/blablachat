import { defineStore } from 'pinia';
import type { User } from '~/types';

export const useAuthStore = defineStore('auth', () => {
  const user = useCookie<User | null>('user', { default: () => null });
  const token = useCookie<string | null>('token', { default: () => null });

  const isLoggedIn = computed(() => !!user.value && !!token.value);

  function login(newUser: User, newToken: string) {
    user.value = newUser;
    token.value = newToken;
  }

  function logout() {
    user.value = null;
    token.value = null;
  }

  return { user, token, isLoggedIn, login, logout };
});
