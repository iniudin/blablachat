export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return navigateTo("/login");
  }

  if (authStore.isLoggedIn && (to.path === "/login" || to.path === "/register")) {
    return navigateTo("/rooms");
  }
});
