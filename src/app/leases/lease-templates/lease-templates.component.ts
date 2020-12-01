import { Component, OnInit } from '@angular/core';
import { ToolbarService } from '@syncfusion/ej2-angular-documenteditor';

@Component({
  selector: 'app-lease-templates',
  template: `<ejs-documenteditorcontainer serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/" [enableToolbar]=true> </ejs-documenteditorcontainer>`,
  styleUrls: ['./lease-templates.component.css'],
  providers:[ToolbarService]
})
export class LeaseTemplatesComponent implements OnInit {
  //my : string = "my.pdf";
  office : string = "google";
  my : string = `https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.docx`;// `${getbaseUrl()}/src/assets/my.docx`;// '../../../assets/my.docx';   //`${getbaseUrl()}/assets/my.docx`;
  
  constructor() { 
    console.log('path is ' +  this.my);

  }

  ngOnInit(): void {
  }
  
}
const getbaseUrl = (): string => {
  const pathArray = window.location.href.split('/');
  const protocol = pathArray[0];
  const host = pathArray[2];
  return protocol + '//' + host;
}