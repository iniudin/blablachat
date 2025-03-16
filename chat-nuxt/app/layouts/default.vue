<script lang="ts" setup>
const auth = useAuthStore();
const router = useRouter();

watchEffect(() => {
  if (!auth.isLoggedIn) {
    router.push('/login');
  }
});
</script>

<template>
  <UContainer class="py-4">
    <div class="flex items-center justify-between">
      <h1 class="font-bold text-2xl text-(--ui-primary) mb-4">
        Chats
      </h1>
      <div
        v-if="auth.isLoggedIn"
        class="flex items-center gap-4"
      >
        <UButton
          icon="i-lucide-user-plus"
          label="New Chat"
          to="/chats/new"
        />
        <UButton
          icon="i-lucide-user"
          label="Logout"
          @click="auth.logout"
        />
      </div>
    </div>
    <slot />
  </UContainer>
</template>
