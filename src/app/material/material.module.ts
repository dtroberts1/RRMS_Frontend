import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import{MatFormFieldModule} from '@angular/material/form-field';
import{MatInputModule} from '@angular/material/input';
import{MatIconModule} from '@angular/material/icon';
import{ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import { CdkTableModule } from "@angular/cdk/table";
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MatTreeModule } from "@angular/material/tree";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatTableModule} from '@angular/material/table';


const MaterialComponents = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  ReactiveFormsModule,
  MatButtonToggleModule,
  ScrollingModule,
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatExpansionModule,
  CdkTableModule,
  DragDropModule,
  MatTreeModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTableModule,
];


@NgModule({
  declarations: [],
  imports: [
    MaterialComponents
  ],
  exports:[MaterialComponents]
})
export class MaterialModule { }
