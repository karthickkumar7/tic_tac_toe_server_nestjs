import { Injectable, NotFoundException } from '@nestjs/common';
import { Member, Room } from 'typeDefinitions/types';
import { PlayWithFriendDto } from './dtos/play-with-friend.dto';

export interface User {
  username: string;
  socketId: string;
  id: number;
  roomId: string;
}

@Injectable()
export class UserService {
  private users: User[] = [];
  private rooms: Room[] = [];
  private idInc: number = 1;

  addUser(user: PlayWithFriendDto): User {
    const newUser = { ...user, socketId: '', id: this.idInc };
    this.users.push(newUser);
    this.idInc++;
    return newUser;
  }

  getUsers(): User[] {
    return this.users;
  }

  // sockets

  addToRoom(roomname: string, user: Member): boolean {
    const room = this.rooms.find((room) => room.roomname === roomname);
    if (room) {
      // join room
      const userAlreadThere = room.members.find((usr) => usr.id === user.id);
      if (!userAlreadThere) room.members.push(user);

      // check if room is full
      if (room.members.length === 2) {
        return true;
      }
    } else {
      // create room
      const createdRoom = this.rooms.push({
        roomname,
        messages: [],
        members: [user],
      });
    }
    return false;
  }

  addSocketId(id: number, socketId: string): string {
    const user = this.users.find((usr) => usr.id === id);
    // if (!user) throw new NotFoundException('user by that id doesnt exist!');
    user.socketId = socketId;
    return user.socketId;
  }

  removeUser(socketId: string) {
    this.users = this.users.filter((usr) => usr.socketId !== socketId);
    return 'user removed';
  }

  // test dev

  getDb() {
    return { rooms: this.rooms, users: this.users };
  }
}
