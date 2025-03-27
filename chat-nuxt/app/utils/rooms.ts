import type { Room } from "~/types";

const getRooms = async () => {
  return await $fetch<Room[]>("/api/rooms", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const getRoom = async (id: string) => {
  return await $fetch<Room>(`/api/rooms/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const createRoom = async (data: Partial<Room>) => {
  return await $fetch<Room>("/api/rooms", {
    method: "POST",
    body: data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const joinRoom = async (id: string, inviteCode?: string) => {
  if (inviteCode) {
    return await $fetch<Room>(`/api/rooms/invite?invite_code=${inviteCode}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
  return await $fetch<Room>(`/api/rooms/${id}/join`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const leaveRoom = async (id: string) => {
  return await $fetch<Room>(`/api/rooms/${id}/leave`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export {
  getRooms,
  getRoom,
  createRoom,
  joinRoom,
  leaveRoom,
};
