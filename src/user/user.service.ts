import { Injectable } from '@nestjs/common';
import {
  Credentials,
  Message,
  MessgageData,
  Room,
  User,
} from 'typeDefinitions/types';

@Injectable()
export class UserService {
  private users: User[] = [];
  private rooms: Room[] = [];
  private idInc: number = 1;

  // CREATE JOIN ROOM
  createJoinRoom(data: Credentials) {
    const { roomId, socketId, username } = data;

    const user: User = {
      id: this.idInc,
      roomId,
      socketId,
      username,
      stats: { wins: 0, loss: 0, winPercent: 0 },
    };
    this.users.push(user);
    this.idInc++;

    const room: Room = this.rooms.find((rm) => rm.roomId === roomId);

    if (!room) {
      const createdRoom: Room = {
        full: false,
        members: [user],
        messages: [],
        roomId,
        noOfGames: 0,
      };

      this.rooms.push(createdRoom);
      return { start: false, user, room: createdRoom };
    } else {
      room.members.push(user);
      room.noOfGames++;
      return { start: true, user, room };
    }
  }

  // removes user from room and/or deletes the room if empty
  removeUser(socketId: string) {
    let roomId: string;
    this.users = this.users.filter((usr) => {
      if (usr.socketId === socketId) roomId = usr.roomId;
      if (usr.socketId !== socketId) {
        return true;
      }
    });

    const room = this.rooms.find((rm) => rm.roomId === roomId);
    room.members = room.members.filter((usr) => usr.socketId !== socketId);

    if (room && !room.members.length) {
      this.rooms = this.rooms.filter((rm) => rm.roomId !== roomId);
    }
  }

  // message handler
  createMessage(data: MessgageData): Message {
    const { msg, username, roomId, userId } = data;

    const room = this.rooms.find((rm) => rm.roomId === roomId);
    const message: Message = {
      id: Math.random().toString(),
      message: msg,
      username,
      userId,
    };
    room.messages.push(message);
    return message;
  }

  // test dev
  // DEV
  // DEV
  // DEV
  // DEV
  getDb() {
    return this.rooms;
  }

  getRoom(roomId: string) {
    return this.rooms.find((room) => room.roomId === roomId);
  }
}
