import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component'
import { LiveMapComponent } from './live-map/live-map.component'
import { PickupsComponent } from './pickups/pickups.component';
import { PickupComponent } from './pickups/pickup/pickup.component';
import { PickupNewComponent } from './pickups/pickup-new/pickup-new.component';

import { AppRoutingModule } from './app-routing.module';

// import { LocationsService } from './locations.service';
// import { DriversService } from './drivers/drivers.service'
// import { DriversModule } from './drivers/drivers.module'
// import { DriverStorageService } from './drivers/drivers-database.service'
// import { PickupsModule } from './pickups/pickups.module'
import { PickupsService } from './pickups/pickups.service';
import { AuthenticationService } from './shared/authentication.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { environment } from '../environments/environment';
import { DriversComponent } from './drivers/drivers.component';
import { DriverEditComponent } from './drivers/driver-edit/driver-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    LiveMapComponent,
    DriversComponent,
    DriverEditComponent,
    PickupsComponent,
    PickupComponent,
    PickupNewComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    GoogleMapsModule,
    FormsModule,
    ReactiveFormsModule,      
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,

  ],
  providers: [PickupsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

