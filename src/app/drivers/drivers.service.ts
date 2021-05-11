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
		return this.db.list('drivers').valueChanges().pipe(
			map((drivers) => {let locations = []; drivers.forEach((driver: Driver) => {locations.push(driver.lkl)}); return locations}),
			tap((drivers) => console.log(drivers))
		)
	}

	createDriver(id: string, driver: Driver) {
		this.db.object('drivers/'+id).set(driver)
	}

	updateDriver(id: string, changes: any) {
		this.db.object('drivers/'+id).update(changes)
	}

	updateDriverLocation(id: string, changes: any) {
		this.db.object('drivers/'+id+'/lkl').update(changes)
	}



}