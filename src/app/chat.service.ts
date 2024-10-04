import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:8080/chatHub', {
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Trace)
      .build();
  }

  public startConnection() {
    this.hubConnection.start().catch(err => console.error('Error starting SignalR connection: ', err));
  }

  public onMessageReceived(callback: (user: string, message: string) => void) {
      this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
          // Directly pass the received user and message to the callback
          callback(user, message);
      });
  }


  public sendMessage(user: string, message: string) {
    this.hubConnection.send('SendMessage', user, message)
      .catch(err => console.error('Error sending message: ', err));
  }
}
