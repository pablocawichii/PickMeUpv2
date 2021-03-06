// written by: Pablo Cawich II
// tested by: Pablo Cawich II
// debugged by: Pablo Cawich II

import { Component, OnInit } from '@angular/core';
import { GoogleMap, MapMarker, MapDirectionsService } from '@angular/google-maps'
import { ActivatedRoute, Params, Router } from '@angular/router'

import { Observable, Subscription } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { Pickup } from '../pickup.model';
import { PickupsService } from '../pickups.service';

import { AuthenticationService } from '../../shared/authentication.service'
import { FlashService } from '../../shared/flash.service'


import { Driver } from '../../drivers/driver.model'
import { DriversService } from '../../drivers/drivers.service'

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.css']
})
export class PickupComponent implements OnInit {
  // Variables 
  showRatingForm = false;
  rating = "";
  stars = 0;
  driver: Driver;
  driverLoaded = false;

	pickup: Pickup = new Pickup({lat: 0, lng: 0}, new Date());
	id: string;
	showMap = true;
  center: google.maps.LatLngLiteral = {
  	lat: 17.25053108195495, 
  	lng: -88.76979103434168
  }; 
  zoom = 14;

  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions = [{lat: 0, lng: 0}, {lat: 0, lng: 0}];
  directionsResults$: Observable<google.maps.DirectionsResult|undefined>;

  lat;
  lng;

  constructor(public authenticationService: AuthenticationService,
              private driversService: DriversService,
              private mapDirectionsService: MapDirectionsService,
  			      private pickupsService: PickupsService,
  			      private route: ActivatedRoute,
              private router: Router,
              private flashService: FlashService
              ) { 
  }

  driverSubscription: Subscription = null;
  priv;

  ngOnInit() {
    // Gets id from url
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        
        // Get Pickup Information
	    this.pickupsService.getPickup(this.id)
	    .subscribe((p: Pickup)=> {
	    	// Set Local Information to db information
        this.pickup = p;
  			this.priv = this.authenticationService.priv

        // If already delivered, redirect drivers
	    	if(this.pickup.status == 'delivered') {
	    		if(this.priv == "Driver") {
            this.flashService.setMessage("Pickup Complete");
    				this.router.navigate(['/'])
	    		}
	    		this.removeMap()
          // Show rating form for customers
          if(this.pickup.stars == null) {
            this.showForm()
        	}
        }
        // If customer already retrieved
        else if(this.pickup.status == 'retrieved') {
          // Check for dropoff location
        	if(!!this.pickup.dropOffLocation) {
              if(this.driverSubscription !== null) {
              	this.driverSubscription.unsubscribe()	
              }
              // Show Dropoff Location on map
              this.driverSubscription = this.driversService.getDriver(this.pickup.driver || this.authenticationService.data.uid)
              	.subscribe((driver: Driver) => {
                  this.driver = driver;
                  this.driverLoaded = true;

            			this.markerPositions[0] = this.pickup.dropOffLocation;
              		this.markerPositions[1] = driver.lkl;
              		this.getDirections();
              	})
        	} else {
            // Show no map if no dropoff location
        		this.removeMap();
        	}
        }
        // Show initial pickup location and driver location and directions for driver and when claimed
        else if(this.priv == 'Driver' || this.priv == 'Admin'  || this.pickup.status == 'claimed') {
            this.markerPositions[0] = this.pickup.location;

            if(this.driverSubscription !== null) {
            	this.driverSubscription.unsubscribe()	
            }
            this.driverSubscription = this.driversService.getDriver(this.pickup.driver || this.authenticationService.data.uid)
            	.subscribe((driver: Driver) => {
                this.driver = driver;
                this.driverLoaded = true;

            		this.markerPositions[1] = driver.lkl;
            		this.getDirections();
            	})

        } else {
          // Show only pickup location for customer
          this.markerPositions[0] = this.pickup.location;
          this.markerPositions[1] = {lat: 0, lng: 0}
          this.directionsResults$ = null 
        }
          
        })
	
      }
    )
  }

  // This function retrieves the directions
  getDirections() {
      const request: google.maps.DirectionsRequest = {
        destination: this.markerPositions[0],
        origin: this.markerPositions[1],
        travelMode: google.maps.TravelMode.DRIVING,
      };
      this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));
  
  }

  // Claims pickup for driver
  claim() {
    this.pickupsService.pickupDriver(this.id, this.authenticationService.data.uid)
  }
  
  // Unclaims pickup for driver
  unclaim() {
    this.pickupsService.unclaimPickup(this.id)
  }

  // Driver has retreived customer into vehicle
  retrieved() {
    this.pickupsService.retrieved(this.id)
  }

  // Driver has delivered customer at location
  delivered() {
    this.pickupsService.delivered(this.id)
    this.flashService.setMessage("Pickup Complete");
    this.router.navigate(['/'])
  }

  // Customer has cancelled their pickup
  cancel() {
  this.pickupsService.cancel(this.id)
  this.flashService.setMessage("Pickup Cancelled");
  this.router.navigate(['/'])  
  }

  // Stop Showing Map
  removeMap() {
  	this.showMap = false;
  }

  // Show rating form
  showForm() {
  	this.showRatingForm = true;
  }

  // Submit rating form
  submitRating() {
  	this.pickup.stars = this.stars;
  	this.pickup.rating = this.rating;
    this.flashService.setMessage("Rating submitted!")
  	this.pickupsService.ratePickup(this.id, this.pickup)
  	this.showRatingForm = false;
  }


}




