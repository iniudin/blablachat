<script lang="ts" setup>
import { joinRoom } from "~/utils/rooms";

const query = useRoute().query;
const inviteCode = query.inviteCode as string | undefined;

const message = ref("Joining room...");

onMounted(async () => {
  if (inviteCode) {
    await joinRoom(undefined, inviteCode);
    message.value = "Joined room successfully";
    setTimeout(() => {
      navigateTo("/rooms");
    }, 1000);
  } else {
    message.value = "Invalid invite code";
  }
});
</script>

<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>
