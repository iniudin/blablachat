<script lang="ts" setup>
const authStore = useAuthStore();
const router = useRouter();

watchEffect(() => {
  if (!authStore.isLoggedIn) {
    router.push("/login");
  }
});
</script>

<template>
  <UContainer>
    <slot/>
  </UContainer>
</template>
