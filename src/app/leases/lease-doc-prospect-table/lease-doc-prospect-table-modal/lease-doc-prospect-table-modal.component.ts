import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IDocumentDeliveries } from 'src/app/interfaces/DocumentDeliveries';
import { IDocumentProspectDto, TermType } from 'src/app/interfaces/DocumentProspect';
import { DocumentDeliveryService } from 'src/app/services/documentDelivery.service';
import { LeaseDocumentService } from 'src/app/services/leaseDocument.service';
import { LeasesPopupModal } from '../../leases/leases-popup-modal/leases-popup-modal.component';
import { DocumentDeliveriesModalComponent } from '../document-deliveries-modal/document-deliveries-modal.component';
import { SendLeaseEmailModalComponent } from '../send-lease-email-modal/send-lease-email-modal.component';
import { LeasePdfModalComponent } from './lease-pdf-modal/lease-pdf-modal.component';

interface ModalData {
  content: Iterable<IDocumentProspectDto>,
}

interface EmailedLeaseDocMessage{
  message:string,
  subject: string,
  body: string,
  leaseDocumentId: number,
}

@Component({
  selector: 'app-lease-doc-prospect-table-modal',
  templateUrl: './lease-doc-prospect-table-modal.component.html',
  styleUrls: ['./lease-doc-prospect-table-modal.component.css']
})
export class LeaseDocProspectTableModalComponent implements OnInit {
  action: Subject<any> = new Subject();
  modalRef: MDBModalRef;
  displayedColumns: string[] = ['DocumentName','FName', 'LName', 'ReadOnly','TenantSigned', 'LandlordSigned', 'LeaseDeclined', 'Move-in-Date', 'Term Type', 'Home', 'Room', 'Delivered Date'];
  dataSource : Array<IDocumentProspectDto>;
  content: Iterable<IDocumentProspectDto> = null;
  selection = new SelectionModel<IDocumentProspectDto>(false, []);
  openDocOrPdf : string = "Open Document";
  dateOptions : {hour: string, minute: string, hour12: boolean} = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  termMap = new Map<TermType, string>([
    [TermType.fixedTerm, "Fixed-Term"],
    [TermType.monthToMonth, "Monthly", ],
  ])
  dateNotTimeOptions : {year: string, month: string, day: string} = {
  year: 'numeric', month: 'long', day: 'numeric'
  }
  constructor(
    public dialog: MatDialog, 
    private documentDeliveryService : DocumentDeliveryService,
    private leaseDocumentService : LeaseDocumentService,
    private modalService: MDBModalService,
    ) {
  }
  ngOnInit(): void {
    this.setupTable();
  }

  deleteDocument(){
    if (this.selection != null && this.selection.selected[0] != null){
      this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          inError: false,
          title: "Delete - Are you sure?",
          contentSummary: `Are you sure you would like to delete this lease document "${this.selection.selected[0].DocumentName}"?`,
          errorItems: []
        }
      });
      this.modalRef.content.action.subscribe((deleteLease: boolean)=> {
        this.modalRef.hide();

        if (deleteLease == true){
          this.leaseDocumentService.removeLeaseDocument(this.selection.selected[0].DocumentId)
            .then((result) => {
              // Update UI List
              this.leaseDocumentService.getDocumentProspectDtos()
                .then((leaseDocDtos: Iterable<IDocumentProspectDto>) =>{
                  this.dialog.open(LeasesPopupModal, {
                    data: {
                        title: "Deleted",
                        contentSummary: `${this.selection.selected[0].DocumentName} has been removed`,
                        content: null,
                      }
                  })
                  .afterClosed().subscribe(() => {
                    this.content = leaseDocDtos;
                    this.setupTable();
                  })
              })
            })
          }
      },
      error => {
        console.log(error);
        this.modalRef.hide();
      });
    }
    else{
      this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          inError: true,
          title: "No Row Selected",
          contentSummary: "No row has been selected. Please select a row.",
          errorItems: []
        }
      });
      this.modalRef.content.action.subscribe((result) => {
        this.modalRef.hide();
      },
      error => {
        console.log(error);
        this.modalRef.hide();
      });
    }
  }
  getTermTypeStr(termType: TermType){
    return this.termMap.get(termType);
  }

  setupTable(){
    this.dataSource = Array.from(this.content);    
    this.dataSource.forEach((dataItem) => {
      if (dataItem.MoveInDate != null){
        dataItem.MoveInDate = new Date(dataItem.MoveInDate + 'Z');
      }
      if (dataItem.MoveOutDate != null){
        dataItem.MoveOutDate = new Date(dataItem.MoveOutDate + 'Z');
      }
      if (dataItem.LatestDocDelivery != null){
        dataItem.LatestDocDelivery = new Date(dataItem.LatestDocDelivery + 'Z');
      }

    })    
  }
  nicelyFormatLatestDocDel(item: IDocumentProspectDto){
    if (item != null && item.LatestDocDelivery != null)
    {
      return item.LatestDocDelivery.toLocaleString();
    }
    else
      return null;
  }
  isReadOnly(docPros: IDocumentProspectDto){
    if (docPros.TenantSigned == true){
      return true;
    }
    else{
      return false;
    }
  }
  openDocDeliveries(docPros: IDocumentProspectDto){
    console.log("opening doc deliveries");
      this.documentDeliveryService.GetDocumentDeliveries(docPros.DocumentId).then((documentDeliveries: Iterable<IDocumentDeliveries>) => {
        console.log("back in loadDocumentsHelper, returned object is " + JSON.stringify(documentDeliveries));
        this.modalRef = this.modalService.show(DocumentDeliveriesModalComponent, {
          backdrop: true,
          keyboard: true,
          focus: true,
          show: false,
          ignoreBackdropClick: false,
          class: '',
          containerClass: '',
          animated: true,
            data: {
                content: documentDeliveries,
            }
        });
        this.modalRef.content.action.subscribe(()=> {
          this.modalRef.hide();
        },
        error => {
          console.log(error);
          this.modalRef.hide();
        });
    });
  }
  sendEmail(){
    // Should first open a modal
    if (this.selection != null && this.selection.selected[0] != null)
    {
      this.modalRef = this.modalService.show(SendLeaseEmailModalComponent, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {docProspectDto: this.selection.selected[0]},
        });
        this.modalRef.content.action.subscribe((emailSent: boolean) => {
          this.modalRef.hide();
          if (emailSent == true){
            this.action.next(null);
          }
        },
        error => {
          console.log(error);
          this.modalRef.hide();  
        })
    }
    else{
      this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,        data: {
          inError: true,
          title: "No Row Selected",
          contentSummary: "No row has been selected. Please select a row.",
          errorItems: []
        }
      });
      this.modalRef.content.action.subscribe((result) => {
        this.modalRef.hide();
      },
      error => {
        console.log(error);
        this.modalRef.hide();
      });
    }
    
    // Send email (send back EmailedLeaseDocMessage)
  }
  tableClicked(){
    console.log("Table clicked");
    if (this.selection != null && this.selection.selected[0] != null)
    {
      if(this.selection.selected[0].TenantSigned == true){
        this.openDocOrPdf = "Open PDF";
      }
      else{
        this.openDocOrPdf = "Open Document";
      }
    }
  }

  closeBtnClicked(){
    this.action.next(null);
  }
  openDocument(){
    if (this.selection != null && this.selection.selected[0] != null)
    {
      if (this.openDocOrPdf == "Open Document"){
        this.action.next({
          selectedTemplate: this.selection.selected[0].DocumentName, 
          prospectId: this.selection.selected[0].ProspectId,
          selectedDocId: this.selection.selected[0].DocumentId,
        })
      }
      else if(this.openDocOrPdf == "Open PDF"){
        // Open PDF Viewer
          this.modalRef = this.modalService.show(LeasePdfModalComponent, {
            backdrop: true,
            keyboard: true,
            focus: true,
            show: false,
            ignoreBackdropClick: false,
            class: '',
            containerClass: '',
            animated: true,
          data: {
            LeaseDocId: this.selection.selected[0].DocumentId, // Need to pass in something here!!!!!!
          }
      });
      this.modalRef.content.action.subscribe(() => {
        this.modalRef.hide();
        },
        error => {
          console.log(error);
          this.modalRef.hide();
        });
      }
    }
    else{
      this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          inError: true,
          title: "No Row Selected",
          contentSummary: "No row has been selected. Please select a row.",
          errorItems: []
        }
      });
      this.modalRef.content.action.subscribe((result) => {
        this.modalRef.hide();
      },
      error => {
        console.log(error);
        this.modalRef.hide();
      });
    }
  }
}
