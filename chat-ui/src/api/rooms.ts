import client from "./client";

const getRooms = async () => {
  const response = await client.get("/api/rooms");
  return response.data;
};

const getRoom = async (id: string) => {
  const response = await client.get(`/api/rooms/${id}`);
  return response.data;
};

const createRoom = async (name: string) => {
  const response = await client.post("/api/rooms", {
    name,
  });
  return response.data;
};

const joinRoom = async (id: string) => {
  const response = await client.post(`/api/rooms/${id}/join`);
  return response.data;
};

const leaveRoom = async (id: string) => {
  const response = await client.post(`/api/rooms/${id}/leave`);
  return response.data;
};

export default {
  getRooms,
  getRoom,
  createRoom,
  joinRoom,
  leaveRoom,
};
