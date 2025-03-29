export interface User {
  id: string;
  name: string;
}

export interface RoomMember {
  id: string;
  user: User;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  public: boolean;
  invite_code: string;
  room_members: RoomMember[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  content: string;
  room: Room;
  user: User;
  created_at: string;
  updated_at: string;
}
