import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DriversComponent } from './drivers/drivers.component';
import { DriverEditComponent } from './drivers/driver-edit/driver-edit.component';
import { LiveMapComponent } from './live-map/live-map.component'
import { LoginComponent } from './login/login.component';
import { PickupsComponent } from './pickups/pickups.component';
import { PickupComponent } from './pickups/pickup/pickup.component';
import { PickupNewComponent } from './pickups/pickup-new/pickup-new.component';


const appRoutes: Routes = [
  { path: '',  redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'live-map', component: LiveMapComponent},
  { path: 'drivers', component: DriversComponent},
  { path: 'drivers/edit/:id', component: DriverEditComponent},
  { path: 'pickups', component: PickupsComponent},
  { path: 'pickups/new', component: PickupNewComponent},
  { path: 'pickups/:id', component: PickupComponent},
  { path: '**', redirectTo: '/login'}
]

@NgModule({
	imports: [FormsModule, ReactiveFormsModule,
		RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {

}