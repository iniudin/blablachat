const getRooms = async () => {
  return await useApiFetch('/api/rooms');
};

const getRoom = async (id: string) => {
  return await useApiFetch(`/api/rooms/${id}`);
};

const createRoom = async (name: string, isPublic: boolean) => {
  return await useApiFetch('/api/rooms', { method: 'POST', body: { name, isPublic } });
};

const joinRoom = async (id: string) => {
  return await useApiFetch(`/api/rooms/${id}/join`, { method: 'POST' });
};

const leaveRoom = async (id: string) => {
  return await useApiFetch(`/api/rooms/${id}/leave`, { method: 'POST' });
};

export {
  getRooms,
  getRoom,
  createRoom,
  joinRoom,
  leaveRoom,
};
