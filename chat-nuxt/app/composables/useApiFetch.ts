/* eslint-disable @typescript-eslint/no-explicit-any */
export const useApiFetch = async <T>(url: string, opts: any = {}) => {
  try {
    const API_BASE = useRuntimeConfig().public.apiBase;
    const { token } = useAuthStore();

    const response = await $fetch<T>(`${API_BASE}${url}`, {
      ...opts,
      onRequest: ({ options }) => {
        if (token) {
          options.headers.set("Authorization", `Bearer ${token}`);
        }
      },
      onRequestError: ({ error }) => {
        console.error("Fetch:", error);
      },
      onResponseError: ({ response }) => {
        throw new Error(`Response: ${response._data.error}`);
      },
    });

    return response;
  } catch (error) {
    throw new Error(`API Fetch Error (${url}): ${error}`);
  }
};
