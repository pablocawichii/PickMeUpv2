import { Injectable } from '@angular/core';
import { map, tap, toArray } from 'rxjs/operators'

import { Driver } from './driver.model';
import { Subject, Observable } from 'rxjs'

import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DriversService {
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

	getDriverLocations() {
		return this.db.list('drivers', ref => ref.orderByChild("status").equalTo("Active")).valueChanges().pipe(
			map((drivers) => {let locations = []; drivers.forEach((driver: Driver) => {locations.push(driver.lkl)}); return locations}),
			tap((drivers) => console.log(drivers))
		)
	}
	
	// getPickupId(id: string) {
	// 	return this.db.object('drivers/'+id+'/currentPickup')
	// }

	createDriver(id: string, driver: Driver) {
		this.db.object('drivers/'+id).set(driver)
	}

	updateDriver(id: string, changes: any) {
		this.db.object('drivers/'+id).update(changes)
	}

	removeDriver(id: string) {
		this.db.object('drivers/'+id).remove()
	}

	updateDriverLocation(id: string, changes: any) {
		this.db.object('drivers/'+id+'/lkl').update(changes)
	}

	changeStatus(id: string, status: string) {
		this.db.object('drivers/'+id).update({status: status})
	}

	updateDriverPickup(id: string, pickupId: string) {
		this.db.object('drivers/'+id+'/currentPickup').update(pickupId)
	}

}