import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import{MatFormFieldModule} from '@angular/material/form-field';
import{MatInputModule} from '@angular/material/input';
import{MatIconModule} from '@angular/material/icon';
import{ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {ScrollingModule} from '@angular/cdk/scrolling';


const MaterialComponents = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  ReactiveFormsModule,
  MatButtonToggleModule,
  ScrollingModule
];


@NgModule({
  declarations: [],
  imports: [
    MaterialComponents
  ],
  exports:[MaterialComponents]
})
export class MaterialModule { }
