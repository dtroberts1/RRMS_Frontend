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
@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    CreateAcctScreenComponent,
    CreateAcctEmailConfscrnComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
