import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
  { path: 'homes/home', component: HomeComponent, data: { title: 'Home' } },
  { path: 'homes/addhome', component: AddHomeComponent, data: { title: 'Add Home' } },
  { path: 'homes/room', component: RoomComponent, data: { title: 'Rooms' } },
  { path: 'homes/addroom', component: AddRoomComponent, data: { title: 'Add Room' } },

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
    AddHomeComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    MaterialModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { useHash: true }
    ),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDmNBhieCcLQWf4Bk97IWi-0pYujLH-ODU',
      libraries: ['places']
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
