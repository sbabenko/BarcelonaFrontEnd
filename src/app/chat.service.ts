import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7189/chatHub')
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  public startConnection() {
    this.hubConnection.start().catch(err => console.error('Error starting SignalR connection: ', err));
  }

  public onMessageReceived(callback: (user: string, message: string) => void) {
    this.hubConnection.on('ReceiveMessage', (messageObject: { user: string, message: string }) => {
      callback(messageObject.user, messageObject.message);
    });
  }

  public sendMessage(user: string, message: string) {
    this.hubConnection.send('SendMessage', user, message)
      .catch(err => console.error('Error sending message: ', err));
  }
}
