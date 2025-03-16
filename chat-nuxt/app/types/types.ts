export interface User {
  id: string;
  name: string;
}

export interface Chat {
  id: string;
  name: string;
  users: User[];
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  chat: Chat;
}
