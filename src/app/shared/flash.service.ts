import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class FlashService {
	messageChanged = new Subject<String>();
	message = ""

  constructor() { }

  setMessage(msg: string){
  	this.message = msg;
  	this.messageChanged.next(this.message);
  }

  endMessage() {
  	this.message = "";
  	this.messageChanged.next(this.message);
  }
}
