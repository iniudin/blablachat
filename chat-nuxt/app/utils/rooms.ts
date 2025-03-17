import type { Room } from '~/types';

const getRooms = async () => {
  return await useApiFetch<Room[]>('/api/rooms');
};

const getRoom = async (id: string) => {
  return await useApiFetch<Room>(`/api/rooms/${id}`);
};

const createRoom = async (data: Partial<Room>) => {
  return await useApiFetch<Room>('/api/rooms', { method: 'POST', body: data });
};

const joinRoom = async (id: string) => {
  return await useApiFetch<Room>(`/api/rooms/${id}/join`, { method: 'POST' });
};

const leaveRoom = async (id: string) => {
  return await useApiFetch<Room>(`/api/rooms/${id}/leave`, { method: 'POST' });
};

export {
  getRooms,
  getRoom,
  createRoom,
  joinRoom,
  leaveRoom,
};
