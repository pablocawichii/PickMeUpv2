import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subject, Observable } from 'rxjs'
import { map, tap, toArray } from 'rxjs/operators'
import { Router } from '@angular/router'

import { Pickup } from './pickup.model';
import { FlashService } from '../shared/flash.service'

@Injectable({
  providedIn: 'root'
})
export class PickupsService {
	pickups;


	constructor(private db: AngularFireDatabase, private router: Router,
              private flashService: FlashService) {
		this.pickups = this.db.list('pickups').snapshotChanges().pipe(
			map(pickups=>
				pickups.map(p => {
					let v = { ...p.payload.val() as Pickup}
					let x : Pickup = { id: p.payload.key, ...v }
					x.dateTimeSeconds = (new Date(x.dateTime).valueOf())
					return (
						x
					)}
					
				)
			)
		);
	}

	getAllPickups(){
		return this.db.list('pickups').snapshotChanges()
		.pipe(
			map(pickups=>
				pickups.map(p => {
					let k = { ...p.payload.val() as Pickup}
					let x : Pickup = { id: p.payload.key, ...k }
					x.dateTimeSeconds = (new Date(x.dateTime).valueOf())
					return (
						x
					)}
				)
			)
		)
	}

	getDriverPickup(driverId: string)
	{
		return this.db.list('pickups', ref => ref.orderByChild("driver").equalTo(driverId)).snapshotChanges().pipe(
			map(pickups=>
				pickups.map(p => {
					let k = { ...p.payload.val() as Pickup}
					let x : Pickup = { id: p.payload.key, ...k }
					x.dateTimeSeconds = (new Date(x.dateTime).valueOf())
					return (
						x
					)}
				)
			),
  			map((pick) => pick.filter((p) => p.status == 'claimed'))
		)
	}

	getUnclaimedPickups() //: Observable<any[]>
	{
		return this.db.list('pickups', ref => ref.orderByChild("status").equalTo("unclaimed")).snapshotChanges().pipe(
			
			map(pickups=>
				pickups.map(p => {
					let k = { ...p.payload.val() as Pickup}
					let x : Pickup = { id: p.payload.key, ...k }
					x.dateTimeSeconds = (new Date(x.dateTime).valueOf())
					return (
						x
					)}
				)
			)
		)
	}

	getPickup(id: string){
		return this.db.list('pickups/'+id).snapshotChanges().pipe(
			map(pickup => {
				let output = {}
				pickup.forEach((val) => {
					output[val.key] = val.payload.val()
				})
				return output
			})
		)
	}


	addPickup(pickup: Pickup) {

		let pu = {...pickup, dateTime: pickup.dateTime.toJSON()}

		this.db.list('pickups/').push(pu)
		.then((res) => {
			this.flashService.setMessage("New Pickup Added");
			this.router.navigate (['/pickups/'+res.key])
		})


	}

    ratePickup(id: string, pickup: Pickup) {
    	this.db.object('pickups/'+id).update(pickup)
	}

	pickupDriver(id: string, uid: string) {
    	this.db.object('pickups/'+id).update({driver: uid, status: 'claimed'})
	}

	unclaimPickup(id: string) {
		this.db.object('pickups/'+id).update({driver: null, status: 'unclaimed'})
	}

	retrieved(id: string) {
		this.db.object('pickups/'+id).update({status: 'retrieved'})
	}

	delivered(id: string) {
		this.db.object('pickups/'+id).update({status: 'delivered'})
	}
	cancel(id: string) {
		this.db.object('pickups/'+id).update({status: 'canceled'})
	}

	cancelPickup(id: string) {

	}
}
