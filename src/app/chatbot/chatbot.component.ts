import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Modal } from 'flowbite';
// import { SpeechRecognitionService } from './../../shared/speechrecognition.service';
interface Message {
  content: string;
  isBot: boolean;
}
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  maxPrompts = 100; // Maximum number of prompts allowed for non-subscribers
  promptCount = 0; // Counter for prompts sent by the user
  inputDisabled = false; // Flag to disable input after reaching max prompts
  subscriptionButtonVisible = false; // Flag to show subscription button

  loadingAnswer: boolean = false;
  messages: Message[] = [];
  userMessage: string = '';

  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit() {
    const $modalElement = document.querySelector('#progress-modal') as HTMLElement | null;
    // if ($modalElement) {
    //   this.modal = new Modal($modalElement);
    // }
  }
  //********************* BOT CONVERSATION MANAGEMENT WITH BACKEND */
  sendMessage() {
    if (this.userMessage.trim() === '') {
      return;
    }
    this.messages.push({ content: this.userMessage, isBot: false });
    this.loadingAnswer = true;
    
      if(this.promptCount >= this.maxPrompts){
      this.subscriptionButtonVisible = true;
      this.inputDisabled = true;
      return;
    }
    this.http.post<any>('https://localhost:5000/api/chatbot/query', { message: this.userMessage }).subscribe({
      next: (response) => {
        this.messages.push({ content: response.bot_response, isBot: true });
        this.loadingAnswer = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loadingAnswer = false;
        this.messages.push({ content: "Sorry, there was an error processing your request.", isBot: true });
      }
    });

    this.userMessage = '';
  }


}