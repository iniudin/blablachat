import { createConsumer } from "@rails/actioncable";

export const useCable = () => {
  const { token } = useAuthStore();
  const config = useRuntimeConfig();

  const $cable = createConsumer(config.public.websocketHost + "?token=" + token);

  onBeforeUnmount(() => {
    $cable.disconnect();
  });

  return { $cable };
};
