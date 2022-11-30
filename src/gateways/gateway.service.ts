import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { AddUser } from 'typeDefinitions/types';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: '*',
  },
})
export class GateWayService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  @WebSocketServer()
  private server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      // create, join room
      socket.on('adduser', (data: AddUser, cb) => {
        const { id, roomId, username } = data;
        const socketId = this.userService.addSocketId(id, socket.id);

        const isRoomFull = this.userService.addToRoom(roomId, {
          id,
          username,
          socketId: socket.id,
        });
        socket.join(roomId);
        cb(socketId);

        if (isRoomFull) {
          socket.to(roomId).emit('start', 'hey man the room is full');
        }
      });

      // dev getAllDb
      socket.on('getdb', (_, cb) => {
        cb(this.userService.getDb());
      });

      socket.on('disconnect', () => {
        this.userService.removeUser(socket.id);
      });
    });
  }
}
