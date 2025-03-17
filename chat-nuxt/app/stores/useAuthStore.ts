import { defineStore } from 'pinia';
import type { User } from '~/types';

export const useAuthStore = defineStore('auth', () => {
  const userCookie = useCookie<User | null>('user', { default: () => null });
  const tokenCookie = useCookie<string | null>('token', { default: () => null });

  const user = ref<User | null>(userCookie.value);
  const token = ref<string | null>(tokenCookie.value);

  const isLoggedIn = computed(() => !!user.value && !!token.value);
  const getUser = computed(() => user.value);
  const getToken = computed(() => token.value);

  function login(newUser: User, newToken: string) {
    user.value = newUser;
    token.value = newToken;
    userCookie.value = newUser;
    tokenCookie.value = newToken;
  }

  function logout() {
    user.value = null;
    token.value = null;
    userCookie.value = null;
    tokenCookie.value = null;
  }

  return { user, token, isLoggedIn, getUser, getToken, login, logout };
});
