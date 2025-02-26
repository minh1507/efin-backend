// import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Server } from 'socket.io';
// import * as WebSocket from 'ws';

// @WebSocketGateway({ cors: true, namespace: '/dht' }) // WebSocket for frontend
// export class DhtGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;
//   private esp32Socket: WebSocket;

//   constructor() {
//     this.connectToESP32();
//   }

//   private connectToESP32() {
//     this.esp32Socket = new WebSocket('ws://<ESP32_IP>:81'); // Replace <ESP32_IP> with actual IP

//     this.esp32Socket.on('open', () => {
//       console.log('Connected to ESP32 WebSocket');
//     });

//     this.esp32Socket.on('message', (data) => {
//       const dhtData = JSON.parse(data.toString());
//       console.log('Received DHT Data:', dhtData);
//       this.server.emit('dhtData', dhtData); // Broadcast to Next.js frontend
//     });

//     this.esp32Socket.on('close', () => {
//       console.log('ESP32 WebSocket disconnected. Reconnecting...');
//       setTimeout(() => this.connectToESP32(), 5000);
//     });

//     this.esp32Socket.on('error', (error) => {
//       console.error('ESP32 WebSocket error:', error);
//     });
//   }

//   handleConnection(client: any) {
//     console.log('Frontend connected:', client.id);
//   }

//   handleDisconnect(client: any) {
//     console.log('Frontend disconnected:', client.id);
//   }
// }
