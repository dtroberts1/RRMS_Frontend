import { Component, Inject, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { IDocumentDeliveries } from 'src/app/interfaces/DocumentDeliveries';

@Component({
  selector: 'app-document-deliveries-modal',
  templateUrl: './document-deliveries-modal.component.html',
  styleUrls: ['./document-deliveries-modal.component.css']
})
export class DocumentDeliveriesModalComponent implements OnInit {
  displayedColumns: string[] = ['Delivery Date','To Address', 'DocumentDeclined'];
  action: Subject<any> = new Subject();
  modalRef: MDBModalRef;
  content: Iterable<IDocumentDeliveries> = null;
  dataSource : Array<IDocumentDeliveries>;
  dateOptions : {hour: string, minute: string, hour12: boolean} = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  constructor(
  ) {
   }

  ngOnInit(): void {
    this.dataSource = Array.from(this.content);
    this.dataSource.forEach((dataItem) => {
      dataItem.DeliveryDate = new Date(dataItem.DeliveryDate + 'Z');
    })
  }
  closeBtnClicked(){
    this.action.next(null);
  }
}
