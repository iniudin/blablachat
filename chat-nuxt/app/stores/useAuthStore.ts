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
    async login(email: string, password: string) {
      try {
        const response = await useFetch<{ user: User; token: string }>(
          '/api/login', { method: 'POST', body: { email, password } },
        );

        if (!response.data.value) {
          throw new Error('Login failed');
        }

        this.user = response.data.value.user;
        this.token = response.data.value.token;
      }
      catch (error) {
        throw new Error(
          error instanceof Error ? error.message : 'Login failed',
        );
      }
    },
    async logout() {
      try {
        await useFetch('/api/logout', { method: 'POST' });

        this.user = null;
        this.token = null;
      }
      catch (error) {
        throw new Error(
          error instanceof Error ? error.message : 'Logout failed',
        );
      }
    },
  },
});
