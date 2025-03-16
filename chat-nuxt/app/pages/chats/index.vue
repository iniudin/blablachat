<script lang="ts" setup>
const auth = useAuthStore();
const router = useRouter();

watchEffect(() => {
  if (!auth.isLoggedIn) {
    const query = useRoute().query;
    if (query.register) {
      router.push('/register');
    }
    else {
      router.push('/login');
    }
  }
});
</script>

<template>
  <div>
    <p>Some default layout content shared across all pages</p>
  </div>
</template>
