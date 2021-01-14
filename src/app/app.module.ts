import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DocumentEditorAllModule, DocumentEditorModule } from '@syncfusion/ej2-angular-documenteditor';
import { DocumentEditorContainerModule } from '@syncfusion/ej2-angular-documenteditor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {MaterialModule} from './material/material.module';
import { AppComponent } from './app.component';
import{LoginScreenComponent} from './loginscreen/loginscreen.component';
import { CreateAcctScreenComponent } from './createacctscreen/create-acct-screen/create-acct-screen.component';
import { CreateAcctEmailConfscrnComponent } from './create-acct-email-confscrn/create-acct-email-confscrn/create-acct-email-confscrn.component';
import{Dashboard} from './dashboard/dashboard.component';
import{NavigationComponent} from './navigation/navigation.component';
import { HomesComponent } from './homes/homes.component';
import { TenantsComponent } from './Tenants/tenants.component';
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
import { AddApprovedProspectComponentModal } from './homes/room/add-approved-prospect/add-approved-prospect.component';
import { LeasesComponent } from './leases/leases/leases.component';
import { PendingLeasesComponent } from './leases/pending-leases/pending-leases.component';
import { AddLeaseComponent } from './leases/add-lease/add-lease.component';
import { LeaseTemplatesComponent } from './leases/lease-templates/lease-templates.component';
import { SplitButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { LeaseTemplatePopupModal } from './leases/lease-templates/lease-template-popup-modal/lease-template-popup-modal.component';
import { LeasesPopupModal} from './leases/leases/leases-popup-modal/leases-popup-modal.component';
import { LeaseDocProspectTableModalComponent } from './leases/lease-doc-prospect-table/lease-doc-prospect-table-modal/lease-doc-prospect-table-modal.component';
import { SendLeaseEmailModalComponent } from './leases/lease-doc-prospect-table/send-lease-email-modal/send-lease-email-modal.component';
import { DocumentDeliveriesModalComponent } from './leases/lease-doc-prospect-table/document-deliveries-modal/document-deliveries-modal.component';
import { RemoveRoomModalComponent } from './homes/home/remove-room-modal/remove-room-modal.component';
import { LeaseDocumentApprovalComponent } from './lease-document-approval/lease-document-approval.component';
import { AdminGuard } from './admin/admin.guard';
import { PdfViewerModule  } from '@syncfusion/ej2-angular-pdfviewer';


const appRoutes: Routes = [
 { path: '', children: [
  { path: 'login', component: AppComponent}, /*Using this for when user clicks logout from dashboard */
  { path: 'dashboard' , component: Dashboard, children :
    [
      { path: 'homes', component: HomesComponent, outlet:'view'},
      { path: 'homes/add-home', component: AddHomeComponent, outlet:'view'},
      { path: 'homes/room', component: RoomComponent, outlet:'view'},
      { path: 'homes/viewroom/:id', component: ViewRoomComponent, outlet:'view' },
      { path: 'homes/addroom/:id/:nickname/:nbrRooms', component: AddRoomComponent, outlet:'view' },
      { path: 'homes/:id', component: HomeComponent, outlet:'view'},
      { path: 'homes/:id/:detail', component: HomeComponent, outlet:'view'},
      { path: 'tenants', component: TenantsComponent, outlet:'view' },
      { path: 'billing', component: BillingComponent, outlet:'view' },
      { path: 'backgroundchecks', component: BackgroundChecksComponent, outlet:'view' },
      { path: 'prospects', component: ProspectsComponent, outlet:'view' },
      { path: 'sales', component: SalesComponent, outlet:'view' },
      { path: 'marketing', component: MarketingComponent, outlet:'view' },
      { path: 'settings', component: SettingsComponent, outlet:'view' },
      { path: 'prospects/add-prospect', component: AddProspectComponent, outlet:'view' },
      { path: 'leases', component: LeasesComponent, outlet:'view' },
      { path: 'leases/add-lease', component: AddLeaseComponent, outlet:'view' },
      { path: 'leases/lease-templates', component: LeaseTemplatesComponent, outlet:'view' },
    ]
  },
 ]}, 
 { path: 'lease-appvdcode/:id', component: LeaseDocumentApprovalComponent},
 { path: '**', redirectTo: 'login'},

/* { path: 'login', component: LoginScreenComponent},*/
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
    ModifyPrevRentalComponent,
    AddApprovedProspectComponentModal,
    LeasesPopupModal,
    LeasesComponent,
    PendingLeasesComponent,
    AddLeaseComponent,
    LeaseTemplatesComponent,
    LeaseTemplatePopupModal,
    LeaseDocProspectTableModalComponent,
    SendLeaseEmailModalComponent,
    DocumentDeliveriesModalComponent,
    RemoveRoomModalComponent,
    LeaseDocumentApprovalComponent,
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    imports: [
      BrowserModule,
      PdfViewerModule,
      BrowserAnimationsModule,
      CommonModule,
      ButtonModule,
      SplitButtonModule,
      DocumentEditorModule,
      DocumentEditorAllModule,
      DocumentEditorContainerModule,
      FormsModule,
      MaterialModule,
      HttpClientModule,
      RouterModule.forRoot(
        appRoutes,
        { useHash: true, relativeLinkResolution: 'legacy' }
      ),
      MatDialogModule,
      OverlayModule,
      AgmCoreModule.forRoot({
        apiKey: 'AIzaSyDmNBhieCcLQWf4Bk97IWi-0pYujLH-ODU',
        libraries: ['places']
      })
    ],
    entryComponents:[
      LeaseTemplatePopupModal,
      LeaseDocProspectTableModalComponent,
      SendLeaseEmailModalComponent,
      RemoveRoomModalComponent,
      AddApprovedProspectComponentModal,
      LinkRoomModalComponent,
      AddEmployerComponent,
      AddPrevRentalComponent,
      LeasesPopupModal,
      DialogDataRRMSDialog,
      EditProspectComponent,
    ],
    providers: [HttpClientModule, MatDialogModule],
    bootstrap: [AppComponent],

})
export class AppModule { }
