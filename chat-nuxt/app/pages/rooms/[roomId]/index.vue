<script setup lang="ts">
import { formatDistanceToNow } from "date-fns";
import { deleteRoom } from "~/utils/rooms";
import { useRoom } from "~/composables/useRoom";

definePageMeta({
  requiresAuth: true,
  middleware: "auth",
});

const config = useRuntimeConfig();

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
  room,
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
      await new Promise(resolve => setTimeout(resolve, 500));
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
const router = useRouter();
const handleDeleteRoom = async () => {
  try {
    await deleteRoom(roomId.value as string);
    router.push("/rooms");
    useToast().add({
      title: "Success",
      description: "Room deleted successfully",
      color: "success",
    });
  } catch (error) {
    useToast().add({
      title: "Error",
      description: `Error deleting room: ${error}`,
      color: "error",
    });
  }
};

const formatTimestamp = (timestamp: string) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

const { copy, copied } = useClipboard({ source: `Join ${room.value?.name} room with link ${config.public.baseURL}/join?inviteCode=${room.value?.invite_code}` });
</script>

<template>
  <div class="max-h-[calc(100vh-7rem)] h-[calc(100vh-7rem)] flex flex-col">
    <header class="p-4 font-semibold flex items-center justify-between">
      <div>
        {{ room?.name || 'Unknown Room' }}
        <UBadge
          v-if="room?.public"
          color="success"
          class="ml-2"
        >
          Public
        </UBadge>
        <UBadge
          v-else
          color="error"
          class="ml-2"
        >
          Private
        </UBadge>
      </div>
      <USlideover
        :title="`Room Detail: ${room?.name}`"
        :close="{
          color: 'primary',
          variant: 'outline',
          class: 'rounded-full',
        }"
      >
        <UButton
          icon="i-lucide-more-horizontal"
          color="neutral"
          variant="subtle"
        />

        <template #body>
          <UTabs
            :items="[
              { label: 'Room Details', slot: 'details' as const },
              { label: 'Members', slot: 'members' as const },
            ]"
            variant="link"
            class="gap-4 w-full"
            :ui="{ trigger: 'flex-1' }"
          >
            <template #details>
              <div class="grid grid-cols-2 gap-y-2">
                <div class="font-semibold">
                  Room ID:
                </div>
                <div>{{ room?.id }}</div>
                <div class="font-semibold">
                  Room Name:
                </div>
                <div>{{ room?.name }}</div>
                <div class="font-semibold">
                  Room Type:
                </div>
                <div>{{ room?.public ? 'Public' : 'Private' }}</div>
                <div class="font-semibold">
                  Invite Code:
                </div>
                <div class="break-all">
                  {{ room?.invite_code }}
                </div>
              </div>
              <div class="flex justify-between gap-2 mt-4">
                <UButton
                  :label="copied ? 'Copied' : 'Copy Invite Code'"
                  icon="i-lucide-copy"
                  color="primary"
                  variant="subtle"
                  @click="copy(`Join ${room?.name} room with link ${config.public.baseURL}/join?inviteCode=${room?.invite_code}`)"
                />
                <UButton
                  label="Delete Room"
                  icon="i-lucide-trash"
                  color="error"
                  variant="subtle"
                  @click="handleDeleteRoom()"
                />
              </div>
            </template>
            <template #members>
              <UTable
                :headers="[
                  { title: 'Name', key: 'name' },
                  { title: 'Role', key: 'role' },
                  { title: 'Joined At', key: 'joined_at' },
                ]"
                :data="room?.room_members.map(member => ({
                  name: member.user.name,
                  role: member.role,
                  joined_at: formatTimestamp(member.created_at),
                })) || []"
                class="w-full"
              />
            </template>
          </UTabs>
        </template>
      </USlideover>
    </header>
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
            class="max-w-[70%] rounded-xl p-3 relative border border-(--ui-border)"
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
            <p class="text-xs mt-1 opacity-70">
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
  </div>
</template>
