import { defineStore } from 'pinia';
import type { User } from '~/types/types';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  getters: {
    isLoggedIn(): boolean {
      return !!this.user && !!this.token;
    },
    getUser(): User | null {
      return this.user;
    },
    getToken(): string | null {
      return this.token;
    },
  },
  actions: {
    login(user: User, token: string) {
      this.user = user;
      this.token = token;
    },
    logout() {
      this.user = null;
      this.token = null;
    },
  },
});
