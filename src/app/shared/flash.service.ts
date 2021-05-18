// written by: Pablo Cawich II
// tested by: Pablo Cawich II
// debugged by: Pablo Cawich II

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class FlashService {
	// Public Variables
	messageChanged = new Subject<String>();
	message = ""

  constructor() { }

  // Set the flash message
  setMessage(msg: string){
  	this.message = msg;
  	this.messageChanged.next(this.message);
  }

  // Remove the flash message
  endMessage() {
  	this.message = "";
  	this.messageChanged.next(this.message);
  }
}
