import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(public authenticationService: AuthenticationService, private router: Router) {}

  ngOnInit(){
  // 	if(this.authenticationService.currentPriv != 'anon'){
		// this.router.navigate(['/'])
  // 	}
  	this.authenticationService.userData.subscribe((user) => {
  		if(!!user) {
  			this.router.navigate(['/live-map'])
  		}
  	})
  }

  signUp() {
    this.authenticationService.SignUp(this.email, this.password);
    this.email = ''; 
    this.password = '';
  }

  signIn() {
    // this.authenticationService.setPriv('driver')
    this.authenticationService.SignIn(this.email, this.password);
    this.email = ''; 
    this.password = '';
  }

  signOut() {
    // this.authenticationService.setPriv('anon')
    this.authenticationService.SignOut();
  }

  setPriv(priv: string) {
  	// this.authenticationService.setPriv(priv);
  }

  loginGoogle() {  	
    this.authenticationService.SignInGoogle();
  }
}

