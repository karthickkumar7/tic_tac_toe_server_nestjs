export interface AddUser {
  username: string;
  roomId: string;
}

export interface UpdateSocketEvent {
  roomId: string;
  cellId: string;
}

export interface MessgageData {
  username: string;
  msg: string;
  roomId: string;
  userId: number;
}

export interface WinData {
  roomId: string;
  userId: number;
}

export interface Credentials {
  username: string;
  roomId: string;
  socketId: string;
}

export interface User {
  username: string;
  socketId: string;
  id: number;
  roomId: string;
  stats: {
    wins: number;
    loss: number;
    winPercent: number;
  };
}

export interface Message {
  message: string;
  id: string;
  userId: number;
  username: string;
}

export interface Room {
  roomId: string;
  messages: Message[];
  members: User[];
  full: boolean;
  noOfGames: number;
}
