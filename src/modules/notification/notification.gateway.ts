import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, string>(); // Map userId => socketId

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.clients.set(userId, client.id);
      console.log(`User connected: ${userId} with socketId: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.clients.entries()) {
      if (socketId === client.id) {
        this.clients.delete(userId);
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
  }

  sendNotification(userId: string, notification: any) {
    const socketId = this.clients.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
      console.log(`Sent notification to user ${userId}`);
    }
  }
}
