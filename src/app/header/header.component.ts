import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router'
import { Location } from '@angular/common'

import { AuthenticationService } from '../shared/authentication.service';
import { FlashService } from '../shared/flash.service'

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
	collapsed = true;
	isAuthenticated ;
	user;
	priv = "Anon";
	message: string = '';

	constructor(private router: Router,public authenticationService: AuthenticationService, private location: Location, private flash: FlashService ) {}

	ngOnInit() {
		this.authenticationService.userData.subscribe(user => {
			this.user = user;
			this.isAuthenticated = !!user;
		});
		this.authenticationService.privChanged.subscribe(priv => {
			console.log(this.priv)
			this.priv = priv;
		})
		this.flash.messageChanged.subscribe((msg: string) => {
			this.message = msg;
		})
	}


	onLogout() {
	    this.authenticationService.SignOut();
		this.router.navigate(['/'])
	}

	ngOnDestroy() {
	}

	goBack() {
		this.location.back()
	}

	endFlash() {
		this.flash.endMessage();
	}
}