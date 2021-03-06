// written by: Pablo Cawich II
// tested by: Pablo Cawich II
// debugged by: Pablo Cawich II

import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, Subject } from 'rxjs';
import firebase from 'firebase/app'
import { Router } from '@angular/router'
import { DriversService } from '../drivers/drivers.service'

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
  // Public Variables
  userData: Observable<firebase.User>;
  data: firebase.User
  privChanged = new Subject<string>();
  priv = "Anon";
  status = "none";

  constructor(private angularFireAuth: AngularFireAuth, private router: Router) {
    this.userData = angularFireAuth.user;
  }



  /* Sign up */
  SignUp(email: string, password: string) {
    this.angularFireAuth
      
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        console.log('Successfully signed up!', res);
		this.router.navigate(['/'])
      })
      .catch(error => {
        console.log('Something is wrong:', error.message);
      });    
  }

  /* Sign in */
  SignIn(email: string, password: string) {
    this.angularFireAuth
      
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log('Successfully signed in!');
		this.router.navigate(['/'])
      })
      .catch(err => {
        console.log('Something is wrong:',err.message);
      });
  }

  // Sign up with google authentication
	SignInGoogle() {	
	    this.angularFireAuth
	      
	      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
	      .then(res => {
	        console.log('Successfully signed in!');
			this.router.navigate(['/'])
	      })
	      .catch(err => {
	        console.log('Something is wrong:',err.message);
	      });
	  }  

  /* Sign out */
  SignOut() {
    this.angularFireAuth
      
      .signOut();

  }  

  // Sets and send priv message
  setPriv(str: string){
  	this.priv = str;
  	this.privChanged.next(this.priv)
  }

}