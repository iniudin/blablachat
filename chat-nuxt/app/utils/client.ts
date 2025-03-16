/* eslint-disable @typescript-eslint/no-explicit-any */
export const useApiFetch = async <T>(url: string, options: any = {}) => {
  try {
    const API_BASE = useRuntimeConfig().public.apiBase;
    const { getToken } = useAuthStore();

    const response = await $fetch<T>(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(getToken ? { Authorization: `Bearer ${getToken}` } : {}),
        ...options.headers,
      },
    });

    return response;
  }
  catch (error) {
    console.error(`API Fetch Error (${url}):`, error);
    throw new Error('An error occurred while fetching data.');
  }
};
