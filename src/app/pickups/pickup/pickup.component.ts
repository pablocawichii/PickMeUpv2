import { Component, OnInit } from '@angular/core';
import { GoogleMap, MapMarker, MapDirectionsService } from '@angular/google-maps'
import { ActivatedRoute, Params, Router } from '@angular/router'

import { Observable, Subscription } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { Pickup } from '../pickup.model';
import { PickupsService } from '../pickups.service';

import { AuthenticationService } from '../../shared/authentication.service'

import { Driver } from '../../drivers/driver.model'
import { DriversService } from '../../drivers/drivers.service'

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.css']
})
export class PickupComponent implements OnInit {

  showRatingForm = false;
  rating = "";
  stars = 0;

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
              private router: Router
              ) { 
  }

  driverSubscription: Subscription = null;
  priv;

  ngOnInit() {
  	this.priv = this.authenticationService.priv
	this.authenticationService.privChanged.subscribe(priv => {
		this.priv = priv;
	})

    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        
	    this.pickupsService.getPickup(this.id)
	    .subscribe((p: Pickup)=> {
	    	this.pickup = p;
  			this.priv = this.authenticationService.priv
	    	console.log(p)
	    	if(this.pickup.status == 'delivered') {
	    		if(this.priv == "Driver") {
    				this.router.navigate(['/'])
	    		}
	    		this.removeMap()
            	if(this.pickup.stars == null) {
            		console.log("TESt")
	                this.showForm()
            	}
            }
            else if(this.pickup.status == 'retrieved') {
            	if(!!this.pickup.dropOffLocation) {
	                if(this.driverSubscription !== null) {
	                	this.driverSubscription.unsubscribe()	
	                }
	                this.driverSubscription = this.driversService.getDriver(this.pickup.driver || this.authenticationService.data.uid)
	                	.subscribe((driver: Driver) => {

	              			this.markerPositions[0] = this.pickup.dropOffLocation;
	                		this.markerPositions[1] = driver.lkl;
	                		this.getDirections();
	                	})
            	} else {
            		this.removeMap();
            	}
            }
            else if(this.priv == 'Driver' || this.pickup.status == 'claimed') {
                this.markerPositions[0] = this.pickup.location;

                if(this.driverSubscription !== null) {
                	this.driverSubscription.unsubscribe()	
                }
                this.driverSubscription = this.driversService.getDriver(this.pickup.driver || this.authenticationService.data.uid)
                	.subscribe((driver: Driver) => {
                		console.log(driver)
                		this.markerPositions[1] = driver.lkl;
                		this.getDirections();
                	})

            } else {
              this.markerPositions[0] = this.pickup.location;
              this.markerPositions[1] = {lat: 0, lng: 0}
              this.directionsResults$ = null 
            }
          
        })
	
      }
    )
  }

  getDirections() {
      const request: google.maps.DirectionsRequest = {
        destination: this.markerPositions[0],
        origin: this.markerPositions[1],
        travelMode: google.maps.TravelMode.DRIVING,
      };
      this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));
  
  }

  claim() {
    this.pickupsService.pickupDriver(this.id, this.authenticationService.data.uid)
  }
  unclaim() {
    this.pickupsService.unclaimPickup(this.id)
  }

  retrieved() {
    this.pickupsService.retrieved(this.id)
  }
  delivered() {
    this.pickupsService.delivered(this.id)
    this.router.navigate(['/'])
  }

  removeMap() {
  	this.showMap = false;
  }

  showForm() {
  	this.showRatingForm = true;
  }

  submitRating() {
  	this.pickup.stars = this.stars;
  	this.pickup.rating = this.rating;
  	this.pickupsService.ratePickup(this.id, this.pickup)
  	this.showRatingForm = false;
  }


}




