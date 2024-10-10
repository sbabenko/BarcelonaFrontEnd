import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  username = '';
  newMessage = '';
  messages: { id: string; user: string; text: string; read: boolean }[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.startConnection();
    this.chatService.onMessageReceived((user, message) => {
      console.log(`Message received from ${user}: ${message}`);
      this.messages.push({ id: this.generateId(), user, text: message, read: false });
    });
  }

  sendMessage() {
    if (this.username && this.newMessage) {
      this.chatService.sendMessage(this.username, this.newMessage);
      this.newMessage = '';
    }
  }

  @HostListener('window:focus')
  onWindowFocus() {
    this.checkMessagesVisibility();
    console.log("window focused triggered");
  }

  @HostListener('window:click')
  onWindowClick() {
    this.checkMessagesVisibility();
    console.log("window click triggered");
  }

  private checkMessagesVisibility() {
    this.messages.forEach((message) => {
      const element = document.getElementById(message.id);
      if (element) {
        const bounding = element.getBoundingClientRect();
        if (bounding.top >= 0 && bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth) && 
            !message.read) {
          this.markMessageAsRead(message.id);
        }
      }
    });
  }

  private markMessageAsRead(messageId: string) {
    const currentUser = this.username; // Get the current user
    this.chatService.sendReadReceipt(messageId, currentUser);
    console.log("Message read by " + currentUser);
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.read = true; // Mark the message as read
    }
  }

  private generateId() {
    return 'msg-' + Math.random().toString(36).substr(2, 9); // Generate a unique ID for the message
  }
}
