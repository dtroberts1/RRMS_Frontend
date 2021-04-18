import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { ICarouselImage } from 'src/app/interfaces/CarouselImage';

@Component({
  selector: 'app-carousel-modifier',
  templateUrl: './carousel-modifier.component.html',
  styleUrls: ['./carousel-modifier.component.scss']
})
export class CarouselModifierComponent implements OnInit {
  action: Subject<any> = new Subject();
  modalRef: MDBModalRef;
  images: Iterable<ICarouselImage> = null;
  constructor() { }

  ngOnInit(): void {
    console.log("on modifier component. Images is " + JSON.stringify(this.images));

  }
  closeDialog(){
    this.action.next(null);
  }
}
