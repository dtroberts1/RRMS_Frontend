import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import{LoginScreenComponent} from './loginscreen/loginscreen.component';
import {MaterialModule} from './material/material.module';
import { CreateAcctScreenComponent } from './createacctscreen/create-acct-screen/create-acct-screen.component';
import { CreateAcctEmailConfscrnComponent } from './create-acct-email-confscrn/create-acct-email-confscrn/create-acct-email-confscrn.component';
import{Dashboard} from './dashboard/dashboard.component';
import{NavigationComponent} from './navigation/navigation.component';
import { HomesComponent } from './homes/homes.component';
import { TenantsComponent } from './Tenants/tenants.component';
import {RouterModule, Routes} from "@angular/router";
import { BillingComponent } from './billing/billing.component';
import { BackgroundChecksComponent } from './backgroundchecks/backgroundchecks.component';
import { ProspectsComponent } from './prospects/prospects.component';
import { SalesComponent } from './sales/sales.component';
import { MarketingComponent } from './marketing/marketing.component';
import { SettingsComponent } from './settings/settings.component';
import { RoomComponent } from './homes/room/room.component';
import { AddRoomComponent } from './homes/add-room/add-room.component';
import { HomeComponent } from './homes/home/home.component';
import { AgmCoreModule } from '@agm/core';
import { AddHomeComponent } from './homes/add-home/add-home.component';
import { MaterialFileUploadComponent } from './material-file-upload/material-file-upload.component';
import { DialogDataRRMSDialog } from './dialog-data/dialog-data.component';
import {MatDialogModule} from '@angular/material/dialog';
import { OverlayModule } from "@angular/cdk/overlay";
import { AddProspectComponent } from './prospects/add-prospect/add-prospect.component';
import { AddEmployerComponent } from './prospects/add-employer/add-employer.component';
import { AddPrevRentalComponent } from './prospects/add-prev-rental/add-prev-rental.component';
import { HomeDetailsComponent } from './homes/home/home-details/home-details.component';
import { ViewRoomComponent } from './homes/room/view-room/view-room.component';
import { AddRoomModalComponent } from './homes/room/add-room-modal/add-room-modal.component';
import { LinkRoomModalComponent } from './homes/room/link-room-modal/link-room-modal.component';
import { EditProspectComponent } from './prospects/edit-prospect/edit-prospect.component';
import { ModifyEmployerModalComponent } from './modify-employer-modal/modify-employer-modal.component';
import { ModifyPrevRentalComponent } from './modify-prev-rental/modify-prev-rental.component';

const appRoutes: Routes = [
  { path: '', component: HomesComponent, data: { title: 'Homes' } },
  { path: 'homes', component: HomesComponent, data: { title: 'Homes' } },
  { path: 'tenants', component: TenantsComponent, data: { title: 'Tenants' } },
  { path: 'billing', component: BillingComponent, data: { title: 'Billing' } },
  { path: 'backgroundchecks', component: BackgroundChecksComponent, data: { title: 'Background Checks' } },
  { path: 'prospects', component: ProspectsComponent, data: { title: 'Prospects' } },
  { path: 'sales', component: SalesComponent, data: { title: 'Sales' } },
  { path: 'marketing', component: MarketingComponent, data: { title: 'Marketing' } },
  { path: 'settings', component: SettingsComponent, data: { title: 'Settings' } },
  { path: 'homes/home/:id', component: HomeComponent, data: { title: 'Home' } },
  { path: 'homes/home/:id/:detail', component: HomeComponent, data: { title: 'Home' } },
  { path: 'homes/addhome', component: AddHomeComponent, data: { title: 'Add Home' } },
  { path: 'homes/room', component: RoomComponent, data: { title: 'Rooms' } },
  { path: 'homes/viewroom/:id', component: ViewRoomComponent, data: { title: 'Add Room' } },
  { path: 'homes/addroom/:id/:nickname/:nbrRooms', component: AddRoomComponent, data: { title: 'Add Room' } },
  { path: 'prospects/add-prospect', component: AddProspectComponent, data: { title: 'Add Prospect' } },

];
@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    CreateAcctScreenComponent,
    CreateAcctEmailConfscrnComponent,
    Dashboard,
    NavigationComponent,
    HomesComponent,
    TenantsComponent,
    BillingComponent,
    BackgroundChecksComponent,
    ProspectsComponent,
    SalesComponent,
    MarketingComponent,
    SettingsComponent,
    RoomComponent,
    AddRoomComponent,
    HomeComponent,
    HomesComponent,
    AddHomeComponent,
    MaterialFileUploadComponent,
    DialogDataRRMSDialog,
    AddProspectComponent,
    AddEmployerComponent,
    AddPrevRentalComponent,
    HomeDetailsComponent,
    ViewRoomComponent,
    AddRoomModalComponent,
    LinkRoomModalComponent,
    EditProspectComponent,
    ModifyEmployerModalComponent,
    ModifyPrevRentalComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { useHash: true }
    ),
    MatDialogModule,
    OverlayModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDmNBhieCcLQWf4Bk97IWi-0pYujLH-ODU',
      libraries: ['places']
    })
  ],
  providers: [MatDialogModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
