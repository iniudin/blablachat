import client from "./client";

const sendMessage = async (roomId: string, content: string) => {
  const response = await client.post(`/api/rooms/${roomId}/messages`, {
    content,
  });
  return response.data;
};

const getMessages = async (roomId: string, page = 1, perPage = 10) => {
  const response = await client.get(`/api/rooms/${roomId}/messages`, {
    params: {
      page,
      per_page: perPage,
    },
  });
  return response.data;
};

export default {
  sendMessage,
  getMessages,
};
