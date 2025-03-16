<template>
  <div class="flex flex-col items-center justify-center gap-4 h-screen">
    <h1 class="font-bold text-2xl text-(--ui-primary)">BlaBla Chat</h1>
    <p>
      Demonstration Chat App with RoR and Nuxt
    </p>

    <div class="flex items-center gap-4">
      <UButton
        icon="i-lucide-log-in"
        label="Login"
        to="/login"
        variant="subtle"
      />
      <UButton
        icon="i-lucide-user-plus"
        label="Register"
        to="/reister"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
</script>