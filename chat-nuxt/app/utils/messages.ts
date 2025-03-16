const sendMessage = async (roomId: string, content: string) => {
  return await useApiFetch(`/api/rooms/${roomId}/messages`, { method: 'POST', body: { content } });
};

const getMessages = async (roomId: string, page = 1, perPage = 10) => {
  return await useApiFetch(`/api/rooms/${roomId}/messages`, {
    params: {
      page,
      per_page: perPage,
    },
  });
};

export default {
  sendMessage,
  getMessages,
};
