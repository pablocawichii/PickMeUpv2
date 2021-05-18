// written by: Pablo Cawich II
// tested by: Pablo Cawich II
// debugged by: Pablo Cawich II

import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router'
import { Location } from '@angular/common'

import { AuthenticationService } from '../shared/authentication.service';
import { DriversService } from '../drivers/drivers.service';
import { FlashService } from '../shared/flash.service'

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
	// Variables
	collapsed = true;
	isAuthenticated ;
	user;
	priv = "Anon";
	status = "Active"
	message: string = '';

	constructor(private router: Router,public authenticationService: AuthenticationService, private location: Location, private driversService: DriversService, private flash: FlashService ) {}

	ngOnInit() {
		// User information access given to header
		this.authenticationService.userData.subscribe(user => {
			this.user = user;
			this.isAuthenticated = !!user;
		});
		// User privelage given to header
		this.authenticationService.privChanged.subscribe(priv => {
			this.priv = priv;
			this.status = this.authenticationService.status
		})
		// Flash Message System Initialized
		this.flash.messageChanged.subscribe((msg: string) => {
			this.message = msg;
		})
	}

	// Logs out the user
	onLogout() {
	    this.authenticationService.SignOut();
		this.router.navigate(['/'])
	}

	ngOnDestroy() {
	}

	// Goes back like back on a browser
	goBack() {
		this.location.back()
	}

	// Closes flash message
	endFlash() {
		this.flash.endMessage();
	}

	// Changes driver status
	changeStat() {
		if(this.authenticationService.status == "Active") {
			this.driversService.changeStatus(this.authenticationService.data.uid, "Inactive")
		} else {
			this.driversService.changeStatus(this.authenticationService.data.uid, "Active")
		}
	}
}