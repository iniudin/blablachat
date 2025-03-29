export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return navigateTo("/login");
  }
});
