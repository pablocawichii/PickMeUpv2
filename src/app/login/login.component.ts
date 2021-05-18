// written by: Pablo Cawich II
// tested by: Pablo Cawich II
// debugged by: Pablo Cawich II

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Variables
  email: string;
  password: string;
  cust = true;

  constructor(public authenticationService: AuthenticationService, private router: Router) {}

  ngOnInit(){
    // If user already logged in redirect
  	this.authenticationService.userData.subscribe((user) => {
  		if(!!user) {
  			this.router.navigate(['/live-map'])
  		}
  	})
  }

  // Creates new user
  signUp() {
    this.authenticationService.SignUp(this.email, this.password);
    this.email = ''; 
    this.password = '';
  }

  // Logs user in
  signIn() {
    this.authenticationService.SignIn(this.email, this.password);
    this.email = ''; 
    this.password = '';
  }

  // Logs user out
  signOut() {
    this.authenticationService.SignOut();
  }

  // Log in using googles authentication
  loginGoogle() {  	
    this.authenticationService.SignInGoogle();
  }

  // Switch View
  switcha() {
    this.cust = !this.cust;
  }
}

