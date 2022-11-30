export interface AddUser {
  id: number;
  username: string;
  roomId: string;
}

export interface User {
  username: string;
  socketId: string;
  id: number;
  roomId: string;
}

export interface Member {
  username: string;
  socketId: string;
  id: number;
}

export interface Message {
  message: string;
  author: string;
  username: string;
}

export interface Room {
  roomname: string;
  messages: Message[];
  members: Member[];
}
