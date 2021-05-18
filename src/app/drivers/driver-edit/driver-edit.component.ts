// written by: Pablo Cawich II
// tested by: Pablo Cawich II
// debugged by: Pablo Cawich II

import { Component, OnInit } from '@angular/core';

import { Driver } from '../driver.model'
import { DriversService } from '../drivers.service'
import { ActivatedRoute, Params, Router } from '@angular/router'

import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { Pickup } from '../../pickups/pickup.model'
import { PickupsService } from '../../pickups/pickups.service'

@Component({
  selector: 'driver-edit',
  templateUrl: './driver-edit.component.html',
  styleUrls: ['./driver-edit.component.css']
})
export class DriverEditComponent implements OnInit {
  // Initialize Variables
	driver: Driver;
	id: string
	formCurrentCar: number;
  	driverForm: FormGroup;

  constructor(private driversService: DriversService,
  			  private route: ActivatedRoute,
              private router: Router,
              private pickupsService: PickupsService) { }

  ngOnInit(){
    // Get Driver from url
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.driversService.getDriver(this.id).subscribe((driver: Driver) => {
        	this.driver = driver;
        	this.initForm();
        });
      }
      )
  }

  // Initialize the form
  private initForm() {
    let driverName = '';
    let driverEmail = '';
    let driverStatus = '';
    let driverCars = new FormArray([]);
    let driverCurrentCar = -1;
    

  	const driver = this.driver;

  	driverName = driver.name
  	driverEmail = driver.email
  	driverStatus = driver.status;
  	driverCurrentCar = driver.currentCar;
  	this.formCurrentCar = driver.currentCar;
  	if(driver['cars']) {
  	for ( let car of driver.cars) {
  	  driverCars.push(
  	    new FormGroup({
  	      'model': new FormControl(car.model, Validators.required),
  	      'year': new FormControl(car.year, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
  		  'brand': new FormControl(car.brand, Validators.required),
  		  'color': new FormControl(car.color, Validators.required)              
  	    })
  	    )
  	}
  	}	
      

    this.driverForm = new FormGroup({
      'name': new FormControl(driverName, Validators.required),
      'email': new FormControl(driverEmail, Validators.required),
      'status': new FormControl(driverStatus, Validators.required),
      'currentCar': new FormControl(driverCurrentCar, Validators.required),
      'cars': driverCars
    });
  }

  // Submit the for
  onSubmit() {
    const name = this.driverForm.value['name'];
    const email = this.driverForm.value['email'];
    const currentCar = this.formCurrentCar;
    const status = this.driverForm.value['status'];
    const cars = this.driverForm.value['cars'];

    const newDriver = new Driver(email, name, status, this.id, this.driver.priv)
    newDriver.cars = cars;
    newDriver.currentCar = currentCar;
    newDriver.lkl = this.driver.lkl;
    newDriver.rating = this.driver.rating;

    // Update the driver in db
    this.driversService.updateDriver(this.id, newDriver);

    // Navigate away from page
    this.router.navigate(["./drivers"]);
  }
  
  getDriversCtrl(){
    return (<FormArray>this.driverForm.get('cars')).controls;
  }

  // Removes a car from list
  onDeleteCar(index: number) {
    (<FormArray>this.driverForm.get('cars')).removeAt(index);
  }

  // Sets the current car to the car clicked
	makeCurrentCar(index: number) {
		this.formCurrentCar = index;
	}

  // Add a car to list
  onAddCar() {
    (<FormArray>this.driverForm.get('cars')).push(
            new FormGroup({
              'model': new FormControl(null, Validators.required),
              'year': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
			  'brand': new FormControl(null, Validators.required),
			  'color': new FormControl(null, Validators.required)              
            })
            )
  }

  // Cancel editing
  onCancel() {
    this.router.navigate(["./../.."], {relativeTo: this.route})
  }

  // Deletes the driver
  removeDriver() {
    this.driversService.removeDriver(this.id);
    this.router.navigate(["./drivers"]);
  }

  // Manually do the driver ratings
  doRating() {
    this.pickupsService.getPickupsForDriver(this.id).subscribe(pickups => {
      let sum: number = 0;
      for (var i = pickups.length - 1; i >= 0; i--) {
        if(typeof(pickups[i].stars) != "undefined" ){
          sum += Number(pickups[i].stars)
          console.log(pickups[i].stars)
        }
      }

      console.log(sum)

      this.driver.rating = (pickups.length != 0) ? (sum / pickups.length): 5;

      this.onSubmit()
    })
  }

}
