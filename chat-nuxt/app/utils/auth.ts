import type { User } from '~/types';

const login = async (name: string, password: string) => {
  return await $fetch<{ user: User; token: string }>(
    '/api/login', { method: 'POST', body: { name, password } },
  );
};

const logout = async () => {
  return await useApiFetch('/api/logout', { method: 'DELETE' });
};

const register = async (name: string, password: string) => {
  return await useApiFetch('/api/register', { method: 'POST', body: { name, password } });
};

export {
  login,
  logout,
  register,
};
