import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'

import { AuthenticationService } from './shared/authentication.service'
import { Driver } from './drivers/driver.model'
import { DriversService } from './drivers/drivers.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PickMeUp';
  subscription: Subscription;
  priv;
  lastKnownLocation = {lat: 0, lng: 0};

  constructor(private authenticationService: AuthenticationService, private driversService: DriversService){
  	authenticationService.userData.subscribe( (user) => {
  		authenticationService.data = user;
  		if(this.subscription != null){
  			this.subscription.unsubscribe()
  		};

      if(!!user){
    		this.subscription = driversService.getDriver((!!user ? user.uid : '0')).subscribe((driver: Driver) => {
    			let test = (Object.keys(driver).length === 0 && driver.constructor === Object)
  	  		if(test) {
            this.priv = "Anon"
            authenticationService.status = "none" 
  		  		authenticationService.setPriv("Anon");
  	  		} else {
              this.priv = driver.priv
              authenticationService.status = driver.status
              this.lastKnownLocation = driver.lkl 
    	  			authenticationService.setPriv(driver.priv);
  	  		}
    		})
      } else {
        this.priv = "-"
        authenticationService.status = "none"
        authenticationService.setPriv("-");
      }
		
  	})

  }

  ngOnInit() {
  	setInterval(() => {
  		if(this.authenticationService.status == "Active"){
        this.getUserLocation()
  			this.driversService.updateDriverLocation(this.authenticationService.data.uid, this.lastKnownLocation)
  		}
  	}, 5000)
  }

  getUserLocation() {
    // get Users current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lastKnownLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
      })
    } else {
      console.log("User not allowed")
      return {lat: 0, lng: 0};
    }

  }
}
