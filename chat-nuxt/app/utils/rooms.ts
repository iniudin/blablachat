import type { Room } from "~/types";

const getRooms = async () => {
  return await useApiFetch<Room[]>("/api/rooms");
};

const getRoom = async (id: string) => {
  return await useApiFetch<Room>(`/api/rooms/${id}`);
};

const createRoom = async (data: Partial<Room>) => {
  return await useApiFetch<Room>("/api/rooms", {
    method: "POST",
    body: data,
  });
};

const deleteRoom = async (id: string) => {
  return await useApiFetch<Room>(`/api/rooms/${id}`, {
    method: "DELETE",
  });
};

const joinRoom = async (id?: string, inviteCode?: string) => {
  if (inviteCode) {
    return await useApiFetch<Room>(`/api/rooms/invite?invite_code=${inviteCode}`);
  } else if (id) {
    return await useApiFetch<Room>(`/api/rooms/${id}/join`, {
      method: "POST",
    });
  } else {
    throw new Error("Room ID or Invite Code is required");
  }
};

const leaveRoom = async (id: string) => {
  return await useApiFetch<Room>(`/api/rooms/${id}/leave`, {
    method: "POST",
  });
};

export {
  getRooms,
  getRoom,
  createRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
};
