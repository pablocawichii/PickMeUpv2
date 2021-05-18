// written by: Pablo Cawich II
// tested by: Pablo Cawich II
// debugged by: Pablo Cawich II

import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs'
import { Router } from '@angular/router'

import { Pickup } from './pickup.model';
import { PickupsService } from './pickups.service';
import { AuthenticationService } from '../shared/authentication.service'
import { Driver } from '../drivers/driver.model'
import { DriversService } from '../drivers/drivers.service'

@Component({
  selector: 'app-pickups',
  templateUrl: './pickups.component.html',
  styleUrls: ['./pickups.component.css']
})
export class PickupsComponent implements OnInit {
  // Variables
	pickups: Pickup[];
	listOfPickups;
	currentDate: Date;
  showList = false;
  showRequestButton = false;
  priv;
  driverPickups: Pickup[];
  showDriverPickups = false;

  constructor(private pickupsService: PickupsService, public auth: AuthenticationService, public driversService: DriversService, private router: Router) { }

  ngOnInit() {
    // Retreives user privelige
    this.priv = this.auth.priv;

    // Drivers can view requests 
    if(this.priv == "Driver" || this.priv == "Admin") {
      this.showRequestButton = true;  
      // Check for Claimed pickups from specific driver 
      this.pickupsService.getDriverPickup(this.auth.data.uid).subscribe(pickups => {
        this.driverPickups = pickups;
        if(this.driverPickups.length != 0) {
          this.showDriverPickups = true;
        } else {
          this.showDriverPickups = false;
        }
      });
      // Retreive all unclaimed pickups
    	this.pickupsService.getUnclaimedPickups().subscribe(pickups => {
    		this.pickups = pickups;
    	});
    // Redirects users who do not have right permissions
    } else if(this.priv == "-") {
        this.router.navigate(['./live-map'])
    }

    // Consistenly update the time
  	this.currentDate = new Date();
  	setInterval(() => {
  		this.currentDate = new Date();
  	}, 5000)
  }

  // Convert ms to readable time
	convertToString(num) {
		num = Math.floor(num / 1000) 
		let seconds = num % 60;
		num = Math.floor(num / 60);
		let minutes = num % 60;
		num = Math.floor(num / 60);
		let hours = num;
		return `${hours}:${minutes}:${seconds}`
	}

  // Switches between multiple views
  switchView() {
      this.showList = !this.showList;  
  }

}
