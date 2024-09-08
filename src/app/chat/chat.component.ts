import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'] // Fix styleUrls to plural form
})
export class ChatComponent implements OnInit {
  username = '';
  newMessage = '';
  messages: { user: string, text: string }[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.startConnection();
    this.chatService.onMessageReceived((user, message) => {
      this.messages.push({ user, text: message });
    });
  }

  sendMessage() {
    if (this.username && this.newMessage) {
      this.chatService.sendMessage(this.username, this.newMessage);
      this.newMessage = '';
    }
  }
}
