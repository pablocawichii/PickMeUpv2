// written by: Pablo Cawich II
// tested by: Pablo Cawich II
// debugged by: Pablo Cawich II

import { Component, OnInit } from '@angular/core';

import { Pickup } from '../pickup.model';
import { PickupsService } from '../pickups.service';
import { FlashService } from '../../shared/flash.service'
import { AuthenticationService } from '../../shared/authentication.service'

@Component({
  selector: 'app-pickup-new',
  templateUrl: './pickup-new.component.html',
  styleUrls: ['./pickup-new.component.css']
})
export class PickupNewComponent implements OnInit {
	// Variables
	show = false;
	zoom = 14;
	center: google.maps.LatLngLiteral = {
		lat: 17.25053108195495, 
		lng: -88.76979103434168
	}; 
	markerOptions: google.maps.MarkerOptions = {draggable: false};
	dropOffAccept: false;
	dropOffPosition : {lat: number, lng: number};


	constructor(private pickupsService: PickupsService,
              	private flashService: FlashService, private auth: AuthenticationService) { }

	ngOnInit(): void {
	}

	// Shows Destination Map
	showMap() {
		if(this.show) {
			this.show = false;
			this.dropOffPosition = null;
		} else {
			this.show = true;
		}
	}

	// Add Destination Marker
	addMarker(event: google.maps.MapMouseEvent) {
		this.dropOffPosition = event.latLng.toJSON()
		console.log(event.latLng.toJSON())
	}

	// Add new Pickup to db
	newPickup() {
	if (navigator.geolocation) {
		// Retreive customer current location
	  	navigator.geolocation.getCurrentPosition(position => {
	      	let nPickup = new Pickup({lat: position.coords.latitude, lng: position.coords.longitude}, new Date() );
	      	// Only add dropoff location if wanted
	      	nPickup.cust = this.auth.data.uid
	      	if(!!this.dropOffPosition) {
	      		nPickup.dropOffLocation = this.dropOffPosition;
	      	}

		  	this.pickupsService.addPickup(nPickup);
		})
	} else {
		alert("Cannot retrieve location. Please allow location.")
	}
	}

}
