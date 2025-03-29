<script lang="ts" setup>
import { ULink } from "#components";

const auth = useAuthStore();

function handleLogout() {
  auth.logout();
  navigateTo("/login");
}
</script>

<template>
  <UContainer class="py-4">
    <div class="sticky top-0 flex items-center justify-between">
      <h1 class="font-bold text-2xl text-(--ui-primary) mb-4">
        <ULink :to="auth.isLoggedIn ? '/rooms' : '/'">
          BlaBla Chat
        </ULink>
      </h1>
      <div
        v-if="auth.isLoggedIn"
        class="flex items-center gap-4"
      >
        Logged in as {{ auth.user?.name }}
        <UButton
          icon="i-lucide-user"
          label="Logout"
          @click="handleLogout"
        />
      </div>
    </div>
    <slot></slot>
  </UContainer>
</template>
