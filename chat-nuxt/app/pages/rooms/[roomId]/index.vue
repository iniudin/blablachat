<script setup lang="ts">
import { formatDistanceToNow } from "date-fns";
import { useRoom } from "~/composables/useRoom";

const route = useRoute();
const roomId = ref(route.params.roomId);
const { user: currentUser } = useAuthStore();
const messagesEndRef = ref<HTMLElement | null>(null);
const messagesContainerRef = ref<HTMLElement | null>(null);

const {
  messages,
  loading,
  error,
  typingUsers,
  hasMore,
  sendTypingStatus,
  sendMessage,
  loadMoreMessages,
} = useRoom(roomId.value as string);

const isLoadingMore = ref(false);

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesEndRef.value) {
      messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
    }
  });
};

const handleScroll = async () => {
  if (!messagesContainerRef.value) return;

  const { scrollTop } = messagesContainerRef.value;

  if (scrollTop === 0 && hasMore.value && !isLoadingMore.value) {
    try {
      isLoadingMore.value = true;
      const currentScrollHeight = messagesContainerRef.value.scrollHeight;
      await loadMoreMessages();

      nextTick(() => {
        if (messagesContainerRef.value) {
          const newScrollHeight = messagesContainerRef.value.scrollHeight;
          messagesContainerRef.value.scrollTop = newScrollHeight - currentScrollHeight;
        }
      });
    } finally {
      isLoadingMore.value = false;
    }
  }
};

onMounted(() => {
  if (messagesContainerRef.value) {
    messagesContainerRef.value.addEventListener("scroll", handleScroll);
  }
  scrollToBottom();
});

onUnmounted(() => {
  if (messagesContainerRef.value) {
    messagesContainerRef.value.removeEventListener("scroll", handleScroll);
  }
});

watch(messages, () => {
  scrollToBottom();
});

const newMessage = ref("");
const handleSendMessage = async () => {
  if (!newMessage.value.trim()) return;
  await sendMessage(newMessage.value);
  newMessage.value = "";
};

const formatTimestamp = (timestamp: string) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};
</script>

<template>
  <UContainer class="h-screen flex flex-col">
    <header class="p-4 text-center font-semibold">
      Room: {{ roomId }}
    </header>
    <!-- Messages Container -->
    <div
      ref="messagesContainerRef"
      class="flex-1 overflow-y-auto p-4 space-y-4"
    >
      <UAlert
        v-if="loading && messages.length === 0"
        title="Loading messages"
        description="Please wait while messages are being loaded"
        color="info"
        variant="soft"
      />

      <UAlert
        v-if="isLoadingMore"
        title="Loading more messages"
        color="info"
        variant="soft"
      />

      <UAlert
        v-if="error"
        title="Error"
        :description="error"
        color="error"
        variant="soft"
      />

      <template v-else>
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex items-start space-x-3"
          :class="msg.user.id === currentUser?.id ? 'flex-row-reverse space-x-reverse' : ''"
        >
          <UAvatar
            :alt="msg.user.name"
            :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user.name}`"
            size="md"
          />
          <div
            class="max-w-[70%] rounded-xl p-3 relative border border-gray-200"
            :class="msg.user.id === currentUser?.id
              ? 'rounded-tr-none'
              : 'rounded-tl-none'"
          >
            <p class="text-sm font-medium mb-1">
              {{ msg.user.name }}
            </p>
            <p class="text-sm">
              {{ msg.content }}
            </p>
            <p
              class="text-xs mt-1 opacity-70"
              :class="msg.user.id === currentUser?.id ? 'text-primary-100' : 'text-gray-500'"
            >
              {{ formatTimestamp(msg.created_at) }}
            </p>
          </div>
        </div>
      </template>

      <div ref="messagesEndRef"></div>
    </div>

    <div
      v-if="Object.keys(typingUsers).length > 0"
      class="px-4 py-2 text-sm"
    >
      {{ Object.values(typingUsers).map(user => user.name).join(', ') }} typing...
    </div>
    <div class="p-4 flex items-center space-x-2">
      <UInput
        v-model="newMessage"
        placeholder="Type your message..."
        class="flex-1"
        @input="sendTypingStatus(true)"
        @blur="sendTypingStatus(false)"
        @keyup.enter="handleSendMessage"
      />
      <UButton @click="handleSendMessage">
        Send
      </UButton>
    </div>
  </UContainer>
</template>
