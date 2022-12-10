import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserService } from 'src/user/user.service';
import {
  AddUser,
  MessgageData,
  UpdateSocketEvent,
} from 'typeDefinitions/types';

interface WinData {
  winnerId: number;
  roomId: string;
}

interface LossData {
  looserId: number;
  roomId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['POST', 'GET'],
  },
})
export class GateWayService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  @WebSocketServer()
  private server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      // CREATE JOIN ROOM
      // EVENT
      socket.on('playcredentials', (data: AddUser, cb) => {
        const { roomId, username } = data;

        const credentials = {
          username,
          socketId: socket.id,
          roomId,
        };
        const { room, start, user } =
          this.userService.createJoinRoom(credentials);
        socket.join(roomId);
        cb({ user, room });

        if (start) {
          const first = room.members[Math.floor(Math.random() * 2)].id;
          this.server.emit('start', { first, members: room.members });
        }
      });

      // UPDATE BOARD
      // EVENT
      socket.on('update', (data: UpdateSocketEvent) => {
        socket.to(data.roomId).emit('update', data.cellId);
      });

      socket.on('win', (data: WinData, cb) => {
        const room = this.userService.getRoom(data.roomId);
        const user = room.members.find((usr) => usr.id === data.winnerId);
        user.stats.wins++;
        user.stats.winPercent = (user.stats.wins / room.noOfGames) * 100;
        cb(user);
        socket.to(data.roomId).emit('win', { user });
      });

      socket.on('loss', (data: LossData, cb) => {
        const room = this.userService.getRoom(data.roomId);
        const user = room.members.find((usr) => usr.id === data.looserId);
        user.stats.loss++;
        user.stats.winPercent = (user.stats.wins / room.noOfGames) * 100;
        cb(user);
        socket.to(data.roomId).emit('loss', { user });
      });

      // GAMEOVER
      // EVENT

      socket.on('restart', (roomId: string) => {
        const room = this.userService.getRoom(roomId);
        room.noOfGames++;

        // fisrt turn login
      });
      // stats back from the lost pl
      socket.on('sendstatsback', (data: WinData) => {});

      // MESSAGE
      socket.on('message', (data: MessgageData) => {
        const msg = this.userService.createMessage(data);
        this.server.to(data.roomId).emit('message', msg);
      });

      socket.on('disconnect', () => {
        this.userService.removeUser(socket.id);
        // this.userService.removeUser(socket.id);
      });
    });
  }
}
