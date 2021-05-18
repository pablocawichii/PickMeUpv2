// written by: Pablo Cawich II
// tested by: Pablo Cawich II
// debugged by: Pablo Cawich II

import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'

import { AuthenticationService } from '../shared/authentication.service';
import { DriversService } from './drivers.service'
import { Driver } from './driver.model'

@Component({
  selector: 'app-driver',
  templateUrl: './drivers.component.html',
  styleUrls: []
})

export class DriversComponent implements OnInit {
  @ViewChild('f', {static: false}) ndForm: NgForm;
  drivers: Driver[]
  show: string;
  
  constructor(private driversService: DriversService, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    // Gets list of all drivers
  	this.driversService.drivers.subscribe(drivers => {
  		this.drivers = drivers
  	})
    // Removes anyone who should not have access
    if(this.authenticationService.priv == "-"){
        this.router.navigate(['./live-map'])
    }
    this.show = 'def';
  }

  // Add new Driver through Form
  addNewDriver(form: NgForm){
      const value = form.value;
      const newDriver = new Driver(value.email, value.name, value.status, value.uid, "Driver");

      this.driversService.createDriver(value.uid, newDriver)

      this.clear()
      this.showView('def')
  }

  clear() {
    this.ndForm.reset();
  }

  // Change View
  showView(str: string) {
    this.show = str;
    console.log(this.show)
  }
}
