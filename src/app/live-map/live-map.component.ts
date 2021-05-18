// written by: Pablo Cawich II
// tested by: Pablo Cawich II
// debugged by: Pablo Cawich II

import { Component, OnInit } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'

import { DriversService } from '../drivers/drivers.service'
import { AuthenticationService } from '../shared/authentication.service';

@Component({
  selector: 'app-live-map',
  templateUrl: './live-map.component.html',
  styleUrls: ['./live-map.component.css']
})
export class LiveMapComponent implements OnInit {
  // Variables 
  center: google.maps.LatLngLiteral = {
  	lat: 17.25053108195495, 
  	lng: -88.76979103434168
  }; 
  zoom = 14;

  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions = [];
  userPosition : {lat: number, lng: number};

  
  constructor(private driversService: DriversService, private authenticationService: AuthenticationService, private router: Router) { }


  addMarker(event: google.maps.MapMouseEvent) {
    console.log(event.latLng.toJSON())
  }


  ngOnInit() {
    // Place user location on map
    this.getUserLocation();

    // Place active users on map
    this.driversService.getDriverLocations()
    .subscribe((locations) => {
    	this.markerPositions = locations;
    })
    
  }


  getUserLocation() {
    // get Users current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.userPosition = {lat: position.coords.latitude, lng: position.coords.longitude};
      })
    }else{
      console.log("User not allowed")
    }
  }

  mapMarkerClick(event: google.maps.MapMouseEvent) {
    console.log(event)
  }

}
