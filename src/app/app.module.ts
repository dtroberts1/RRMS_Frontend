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

const appRoutes: Routes = [
  { path: '', component: HomesComponent, data: { title: 'Homes Component' } },
  { path: 'homes', component: HomesComponent, data: { title: 'Homes Component' } },
  { path: 'tenants', component: TenantsComponent, data: { title: 'Tenants Component' } },
  { path: 'billing', component: BillingComponent, data: { title: 'Billing Component' } },
  { path: 'backgroundchecks', component: BackgroundChecksComponent, data: { title: 'Background Checks Component' } },
  { path: 'prospects', component: ProspectsComponent, data: { title: 'Prospects Component' } },
  { path: 'sales', component: SalesComponent, data: { title: 'Sales Component' } },
  { path: 'marketing', component: MarketingComponent, data: { title: 'Marketing Component' } },
  { path: 'settings', component: SettingsComponent, data: { title: 'Settings Component' } },

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
    SettingsComponent
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
    //RouterOutlet
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
