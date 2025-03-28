<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  password: z.string(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
  password: undefined,
});

const toast = useToast();
const auth = useAuthStore();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await auth.login(event.data.name, event.data.password);

    toast.add({
      title: "Success",
      description: "Logged in successfully",
      color: "success",
    });

    navigateTo("/rooms");
  } catch (error) {
    toast.add({
      title: "Error",
      description: `${error}`,
      color: "error",
    });
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <UCard>
      <template #header>
        <h2 class="font-semibold text-xl">
          Login
        </h2>
        <p class="text-gray-500">
          Please enter your name and password to login.
        </p>
      </template>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Name"
          name="name"
        >
          <UInput
            v-model="state.name"
            class="w-full"
            placeholder="Enter your name"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
        >
          <UInput
            v-model="state.password"
            class="w-full"
            placeholder="Enter your password"
            type="password"
          />
        </UFormField>
        <UButton
          class="w-full items-start"
          type="submit"
        >
          Login
        </UButton>
      </UForm>
      <template #footer>
        <div class="flex items-center gap-2">
          <p>Dont have an account?</p>
          <ULink to="/register">
            Register
          </ULink>
        </div>
      </template>
    </UCard>
  </div>
</template>
