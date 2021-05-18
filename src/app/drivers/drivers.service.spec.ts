import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router'
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database'
import { environment } from '../../environments/environment'

import { Driver } from './driver.model';
import { DriversService } from './drivers.service';

import { of } from 'rxjs';
import { Observable } from 'rxjs';

describe('DriversService', () => {
  let service: DriversService;

  let addDriverSpy: jasmine.Spy;
  let deleteDriverSpy: jasmine.Spy;
  let updateDriverSpy: jasmine.Spy;
  let getDriverSpy: jasmine.Spy;
  let getDriverUpdatedSpy: jasmine.Spy;
  let getDriverNoLocationSpy: jasmine.Spy;


  beforeEach(async() => {
  	
    TestBed.configureTestingModule({
    	imports: [
  		AngularFireModule.initializeApp(environment.firebase),
  		AngularFireDatabaseModule
  		]
    });

  });

  beforeEach(() => {

    service = TestBed.inject(DriversService);

    addDriverSpy = spyOn(service, 'createDriver')
    deleteDriverSpy = spyOn(service, 'removeDriver')
    updateDriverSpy = spyOn(service, 'updateDriver')
    getDriverSpy = spyOn(service, 'getDriver').and.callFake(function(someParam){
	  if (someParam == '13') { 
	      return of({id: '13', email: 'test@email.com', name: "test123", lkl: {lat: -18.123,lng:-17.222}, status: "Active"});
	  } else if (someParam == '14'){
	      return of({id: '14', email: 'test@email.com', name: "test123", lkl: {lat: -18.123,lng:-17.222}, status: "Inactive"});
	  }  else if (someParam == '16'){
	      return of({id: '16', email: 'test@email.com', name: "test123", lkl: {lat: -18.123,lng:-17.222}, status: ""});
	  }  else if (someParam == '17'){
	      return of({id: '17', email: 'test@email.com', name: "test123", lkl: {lat: -18.123,lng:-17.222}, status: ""});
	  } else {
	  	return of({id: '15', email: 'test@email.com', name: "test123", lkl: {lat: 0,lng:0}, status: "Active"});
	  }
	});
  });

  it('#Add Driver', () => {
    service.createDriver('13', new Driver('test@email.com', 'test123', 'Active', '13', 'Driver'))
    
    expect(addDriverSpy).toHaveBeenCalled();
    expect(addDriverSpy.calls.all().length ).toEqual(1)
  
  })

  it('#Delete Driver', () => {
    service.removeDriver('13')
    
    expect(deleteDriverSpy).toHaveBeenCalled();
    expect(deleteDriverSpy.calls.all().length ).toEqual(1)
  })

  it('#Update Driver', () => {
  	service.createDriver('14', new Driver('test@email.com', 'test123', 'Active', '14', 'Driver'))
    
    service.updateDriver('14', new Driver('test@email.com', 'test123', 'Inactive', '14', 'Driver'))
    
    expect(updateDriverSpy).toHaveBeenCalled();
    expect(updateDriverSpy.calls.all().length ).toEqual(1)

    service.getDriver('14').subscribe((driver: Driver) => {
    	expect(driver.status).toEqual('Inactive');
    })
  })

  it('#Get Driver', () => {    
  	service.getDriver('13').subscribe((driver: Driver) => {
    	expect(driver.id).toEqual('13');
    })

    expect(getDriverSpy).toHaveBeenCalled();
    expect(getDriverSpy.calls.all().length ).toEqual(1)
  })

  it('#GetDriverLocation', () => {
  	service.getDriver('13').subscribe((driver: Driver) => {
    	expect(driver.lkl).toEqual({lat: -18.123,lng:-17.222});
    })
    
    expect(getDriverSpy).toHaveBeenCalled();
    expect(getDriverSpy.calls.all().length ).toEqual(1)
  })

  it('Below Will Fail #####', () => {
    fail()
  })

  it('#AddDriver Missing Information', () => {
    service.createDriver('16', new Driver('test@email.com', 'test123', '', '16', 'Driver'))
    
    expect(addDriverSpy).toHaveBeenCalled();
    service.getDriver('16').subscribe((driver: Driver) => {
    	expect(driver.status).toEqual('Active');
    })
  
  })

  it('#UpdateDriver Missing Information', () => {
  	service.createDriver('17', new Driver('test@email.com', 'test123', 'Active', '17', 'Driver'))
    
    service.updateDriver('17', new Driver('test@email.com', 'test123', '', '17', 'Driver'))
    
    expect(updateDriverSpy).toHaveBeenCalled();
    expect(updateDriverSpy.calls.all().length ).toEqual(1)

    service.getDriver('17').subscribe((driver: Driver) => {
    	expect(driver.status).toEqual('Inactive');
    })
  })

  it('#GetDriverLocation User Denies Access', () => {
  	service.getDriver('15').subscribe((driver: Driver) => {
    	expect(driver.lkl).toEqual({lat: -18.123,lng:-17.222});
    })
    
    expect(getDriverSpy).toHaveBeenCalled();
    expect(getDriverSpy.calls.all().length ).toEqual(1);
  })


})