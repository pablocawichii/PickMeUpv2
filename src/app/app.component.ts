import { Component } from '@angular/core';
import { Subscription } from 'rxjs'

import { AuthenticationService } from './shared/authentication.service'
import { Driver } from './drivers/driver.model'
import { DriversService } from './drivers/drivers.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PickMeUp';
  subscription: Subscription;
  priv;

  constructor(private authenticationService: AuthenticationService, private driversService: DriversService){
  	authenticationService.userData.subscribe( (user) => {
  		authenticationService.data = user;
  		if(this.subscription != null){
  			this.subscription.unsubscribe()
  		};


  		this.subscription = driversService.getDriver((!!user ? user.uid : '0')).subscribe((driver: Driver) => {
  			let test = (Object.keys(driver).length === 0 && driver.constructor === Object)
	  		if(test) {
          this.priv = "Anon"
		  		authenticationService.setPriv("Anon");
	  		} else {
            this.priv = driver.priv
  	  			authenticationService.setPriv(driver.priv);
	  		}
  		})
		
  	})
  	setInterval(() => {
  		if(authenticationService.priv == "Driver"){
  			// driversService.updateDriverLocation(authenticationService.data.uid, this.getUserLocation())
  		}
  	}, 5000)
  }

  getUserLocation() {
    // get Users current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        return {lat: position.coords.latitude, lng: position.coords.longitude};
      })
    }else{
      console.log("User not allowed")
      return {lat: 0, lng: 0};
    }
  }
}
