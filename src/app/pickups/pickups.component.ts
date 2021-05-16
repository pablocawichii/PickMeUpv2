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
    this.priv = this.auth.priv;
    if(this.priv == "Driver" || this.priv == "Admin") {
      this.showRequestButton = true;  
      this.pickupsService.getDriverPickup(this.auth.data.uid).subscribe(pickups => {
        this.driverPickups = pickups;
        if(this.driverPickups.length != 0) {
          this.showDriverPickups = true;
        } else {
          this.showDriverPickups = false;
        }
      });
    	this.pickupsService.getUnclaimedPickups().subscribe(pickups => {
    		this.pickups = pickups;
    	});
    } else if(this.priv == "-") {
        this.router.navigate(['./live-map'])

    }

  	this.currentDate = new Date();
  	setInterval(() => {
  		this.currentDate = new Date();
  	}, 5000)
  }

	convertToString(num) {
		num = Math.floor(num / 1000) 
		let seconds = num % 60;
		num = Math.floor(num / 60);
		let minutes = num % 60;
		num = Math.floor(num / 60);
		let hours = num;
		return `${hours}:${minutes}:${seconds}`
	}


  newPickup() {
    if (navigator.geolocation) {
      	navigator.geolocation.getCurrentPosition(position => {
	      	let nPickup = new Pickup({lat: position.coords.latitude, lng: position.coords.longitude}, new Date() );
		  	this.pickupsService.addPickup(nPickup);
    	})
    } else {
		alert("Cannot retrieve location. Please allow location.")
    }
  }

  switchView() {
      this.showList = !this.showList;  
  }

}
