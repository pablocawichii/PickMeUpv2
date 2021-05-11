import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs'

import { Pickup } from './pickup.model';
import { PickupsService } from './pickups.service';
import { AuthenticationService } from '../shared/authentication.service'

@Component({
  selector: 'app-pickups',
  templateUrl: './pickups.component.html',
  styleUrls: ['./pickups.component.css']
})
export class PickupsComponent implements OnInit {
	pickups: Pickup[];
	listOfPickups;
	currentDate: Date;

  constructor(private pickupsService: PickupsService, public auth: AuthenticationService) { }

  ngOnInit() {
  	this.pickupsService.getUnclaimedPickups().subscribe(pickups => {
  		this.pickups = pickups;
  	});

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

}
