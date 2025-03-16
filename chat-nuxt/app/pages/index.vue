<template>
  <div class="flex flex-col items-center justify-center gap-4 h-screen">
    <h1 class="font-bold text-2xl text-(--ui-primary)">
      BlaBla Chat
    </h1>
    <p>
      Demonstration Chat App with Ruby on Rails and Nuxt
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
        to="/register"
      />
    </div>
  </div>
</template>
