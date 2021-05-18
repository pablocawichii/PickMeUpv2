import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router'
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database'
import { environment } from '../../environments/environment'
import { Pickup } from './pickup.model'
import { PickupsService } from './pickups.service';

import { FlashService } from '../shared/flash.service'

import { of } from 'rxjs';

describe('PickupsService', () => {
  let service: PickupsService;

  let requestPickupSpy: jasmine.Spy;
  let viewPickupSpy: jasmine.Spy;
  let claimPickupSpy: jasmine.Spy;

	let serviceStub = {
	  navigate: () => of('You have been warned'),
	  setMessage: () => of('Done')
	};


  beforeEach(async() => {
  	
    TestBed.configureTestingModule({
    	imports: [
  		AngularFireModule.initializeApp(environment.firebase),
  		AngularFireDatabaseModule
  		],
  		providers: [
  			{ provide: Router, useValue: serviceStub },
  			{ provide: FlashService, useValue: serviceStub }
  		]
    });

  });

  beforeEach(() => {

    service = TestBed.inject(PickupsService);

    requestPickupSpy = spyOn(service, 'addPickup')
    viewPickupSpy = spyOn(service, 'getPickup').and.returnValue(of({id: '123', status: 'unclaimed', location: {lat: -18.123,lng:-17.222}}))
    claimPickupSpy = spyOn(service, 'pickupDriver')
  });

  it('#Request Pickup', () => {
  	service.addPickup(new Pickup({lat: -18.123,lng:-17.222}, new Date()))

    expect(requestPickupSpy).toHaveBeenCalled();

  });  

  it('#View Pickup', () => {
  	service.getPickup('123')
  	expect(viewPickupSpy).toHaveBeenCalled();
    expect(viewPickupSpy.calls.all().length ).toEqual(1)
  
  });

  it('#Claim Pickup', () => {
  	service.pickupDriver('123', '1234')
  	expect(claimPickupSpy).toHaveBeenCalled();
    expect(claimPickupSpy.calls.all().length ).toEqual(1)
  });  

  it('Below Will Fail #####', () => {
    expect(!service).toBeTruthy();
  });

  it('#View Pickup With Wrong Id', () => {
  	let ret = service.getPickup('124')
  	expect(viewPickupSpy).toHaveBeenCalled();
    ret.subscribe((pickup: Pickup) => {

    	expect(pickup.id).toEqual('124')
    })
  });  


});


