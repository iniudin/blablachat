import type { User } from '~/types';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { name, password } = await readBody(event);
  const response = await $fetch<{ user: User; token: string }>(`${config.public.apiBase}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { name, password },
  });

  setCookie(event, 'token', response.token, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 30 });
  setCookie(event, 'user', JSON.stringify(response.user), { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 30 });
  return response;
});
