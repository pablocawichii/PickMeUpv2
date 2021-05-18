// written by: Pablo Cawich II
// tested by: Pablo Cawich II
// debugged by: Pablo Cawich II

import { Injectable } from '@angular/core';
import { map, tap, toArray } from 'rxjs/operators'

import { Driver } from './driver.model';
import { Subject, Observable } from 'rxjs'

import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DriversService {
	// Variable that holds all drivers for drivers page
	drivers: Observable<any[]>;

	constructor(private db: AngularFireDatabase) {
		this.drivers = this.db.list('drivers').snapshotChanges().pipe(
			map(drivers=>
				drivers.map(d => {
					let v = { ...d.payload.val() as Driver}
					let x : Driver = { id: d.payload.key, ...v }
					return (
						x
					)}
					
				)
			)
		);
	}

	// Returns a single Driver
	getDriver(id: string){
		return this.db.list('drivers/'+id).snapshotChanges().pipe(
			map(driver => {
				let output = {}
				driver.forEach((val) => {
					output[val.key] = val.payload.val()
				})
				return output
			})
		)
	}

	// Returns the locations of all active drivers
	getDriverLocations() {
		return this.db.list('drivers', ref => ref.orderByChild("status").equalTo("Active")).valueChanges().pipe(
			map((drivers) => {let locations = []; drivers.forEach((driver: Driver) => {locations.push(driver.lkl)}); return locations}),
			tap((drivers) => console.log(drivers))
		)
	}

	// Create a new driver
	createDriver(id: string, driver: Driver) {
		this.db.object('drivers/'+id).set(driver)
	}

	// Updates a driver
	updateDriver(id: string, changes: any) {
		this.db.object('drivers/'+id).update(changes)
	}

	// Removes a driver permanentely
	removeDriver(id: string) {
		this.db.object('drivers/'+id).remove()
	}

	// Updates a drivers location only
	updateDriverLocation(id: string, changes: any) {
		this.db.object('drivers/'+id+'/lkl').update(changes)
	}

	// Updates a drivers status only
	changeStatus(id: string, status: string) {
		this.db.object('drivers/'+id).update({status: status})
	}

	// Updates a driver to allow only one pickup claim
	updateDriverPickup(id: string, pickupId: string) {
		this.db.object('drivers/'+id+'/currentPickup').update(pickupId)
	}

}