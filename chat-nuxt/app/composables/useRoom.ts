import { useCable } from "./useCable";
import { getMessages, sendMessage } from "~/utils/messages";
import { useAuthStore } from "~/stores/useAuthStore";
import type { Message, User } from "~/types";

export function useRoom(roomId: string) {
  const messages = ref<Message[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const typingUsers = reactive<Record<string, User>>({});
  const hasMore = ref(true);
  const page = ref(1);
  const typingTimeouts: Record<string, NodeJS.Timeout> = {};
  let subscription: ActionCable.Subscription | null = null;
  const { user: currentUser } = useAuthStore();

  const loadMessages = async (reset = false) => {
    try {
      loading.value = true;
      const currentPage = reset ? 1 : page.value;
      const data = await getMessages(roomId, currentPage);

      if (data.length === 0) {
        hasMore.value = false;
      } else {
        messages.value = reset ? data : [...data, ...messages.value];
        page.value = currentPage + 1;
      }
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "Failed to load messages";
      }
    } finally {
      loading.value = false;
    }
  };

  const setupSubscription = () => {
    if (!roomId || !currentUser || !import.meta.client) return;

    const { $cable } = useCable();

    if ($cable) {
      subscription = $cable.subscriptions.create(
        { channel: "RoomChannel", room_id: roomId },
        {
          received: (
            data: {
              type: string;
              message?: Message;
              user?: User;
              typing?: boolean;
            }) => {
            switch (data.type) {
              case "NEW_MESSAGE":
                if (data.message) {
                  messages.value = [...messages.value, data.message];
                }
                break;
              case "TYPING":
                if (data.user && data.typing !== undefined) {
                  handleTypingIndicator({
                    user: data.user,
                    typing: data.typing,
                  });
                }
                break;
              case "USER_JOINED":
                break;
              case "USER_LEFT":
                break;
              default:
                break;
            }
          },
          connected: () => {
            loadMessages(true);
          },
          disconnected: () => {
          },
        },
      );
    }
  };

  const handleTypingIndicator = (data: { user: User; typing: boolean }) => {
    const { user, typing } = data;

    if (typingTimeouts[user.id]) {
      clearTimeout(typingTimeouts[user.id]);
    }

    if (typing) {
      typingUsers[user.id] = user;

      typingTimeouts[user.id] = setTimeout(() => {
        Reflect.deleteProperty(typingUsers, user.id);
        Reflect.deleteProperty(typingTimeouts, user.id);
      }, 3000);
    } else {
      Reflect.deleteProperty(typingUsers, user.id);
      Reflect.deleteProperty(typingTimeouts, user.id);
    }
  };

  const sendTypingStatus = (isTyping: boolean) => {
    if (subscription) {
      subscription.perform("typing", { typing: isTyping });
    }
  };

  const sendChatMessage = async (content: string) => {
    try {
      await sendMessage(roomId, content);
      sendTypingStatus(false);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "Failed to send message";
      }
      return false;
    }
  };

  onMounted(() => {
    setupSubscription();
  });

  onUnmounted(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
    Object.keys(typingTimeouts).forEach((userId) => {
      clearTimeout(typingTimeouts[userId]);
    });
  });

  return {
    messages,
    loading,
    error,
    typingUsers,
    hasMore,
    sendTypingStatus,
    sendMessage: sendChatMessage,
    loadMoreMessages: () => loadMessages(false),
  };
}
