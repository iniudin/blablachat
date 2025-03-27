import type { Message } from "~/types";

const sendMessage = async (roomId: string, content: string) => {
  return await $fetch<Message>(`/api/rooms/${roomId}/messages`, {
    method: "POST",
    body: { content },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const getMessages = async (roomId: string, page = 1, perPage = 10) => {
  return await $fetch<Message[]>(`/api/rooms/${roomId}/messages`, {
    params: {
      page,
      per_page: perPage,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export {
  sendMessage,
  getMessages,
};
