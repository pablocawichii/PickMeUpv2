import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'

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
  
  constructor(private driversService: DriversService) { }

  ngOnInit() {
  	this.driversService.drivers.subscribe(drivers => {
  		this.drivers = drivers
  	})
  }

  addNewDriver(form: NgForm){
      const value = form.value;
      const newDriver = new Driver(value.email, value.name, value.status, value.uid, "Driver");

      this.driversService.createDriver(value.uid, newDriver)

      this.clear()
  }

  clear() {
    this.ndForm.reset();
  }

  getThings() {
  	this.driversService.getDriver('0').subscribe(driver => {
  		console.log(driver)
  	})
  }

}
