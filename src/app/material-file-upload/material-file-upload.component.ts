import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpResponse, HttpRequest, 
         HttpEventType, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { of } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';
import { DialogDataRRMSDialog } from '../dialog-data/dialog-data.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-material-file-upload',
  templateUrl: './material-file-upload.component.html',
  styleUrls: ['./material-file-upload.component.css'],
      animations: [
            trigger('fadeInOut', [
                  state('in', style({ opacity: 100 })),
                  transition('* => void', [
                        animate(300, style({ opacity: 0 }))
                  ])
            ])
      ]
})
export class MaterialFileUploadComponent implements OnInit {
  /** Link text */
      @Input() text = 'Upload';
      /** Name used in form which will be sent in HTTP request. */
      @Input() param = 'file';
      /** Target URL for file uploading. */
      @Input() target = 'http://localhost:64097/api/DocumentDeliveries/DeliverAddRecordCustom';
      /** File extension that accepted, same as 'accept' of <input type="file" />. 
          By the default, it's set to 'image/*'. */
      /** Allow you to add handler after its completion. Bubble up response text from remote. */
      @Output() complete = new EventEmitter<FormData>();

      private files: Array<FileUploadModel> = [];

      constructor(private _http: HttpClient,
        public dialog: MatDialog, 
        ) { }

      ngOnInit() {
      }

      onClick() {
            const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
            fileUpload.onchange = () => {
                  for (let index = 0; index < fileUpload.files.length; index++) {
                        const file = fileUpload.files[index];
                        this.files.push({ data: file, state: 'in', 
                          inProgress: false, progress: 0, canRetry: false, canCancel: true });
                  }
                  this.uploadFiles();
            };
            fileUpload.click();
      }

      cancelFile(file: FileUploadModel) {
            file.sub.unsubscribe();
            this.removeFileFromArray(file);
      }

      retryFile(file: FileUploadModel) {
          console.log("in retryFile");
            this.uploadFile(file);
            file.canRetry = false;
      }

      private uploadFile(file: FileUploadModel) {
            let fileExt : string = file.data.name.split('.').pop().toLowerCase();
            if (fileExt != 'pdf' && fileExt != 'doc' && fileExt != 'docx'){
                // Prompt invalid file type
                this.dialog.open(DialogDataRRMSDialog, {
                    data: {
                      inError: true,
                      title: "Invalid File Type",
                      contentSummary: "Invalid Filetype. Try loading a file extension ending with .pdf, .doc, or .docx",
                      errorItems: []
                    }
                  });
                  this.removeFileFromArray(file);
                  file = null;
                return;
            }
            const fd = new FormData();
            console.log("this.param is " + this.param);
            fd.append(this.param, file.data);
            fd.append('LocalFileName', file.data.name);
            this.removeFileFromArray(file);
            file = null;
            this.complete.emit(fd);
      }

      private uploadFiles() {
            const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
            fileUpload.value = '';

            this.files.forEach(file => {
                  this.uploadFile(file);
            });
      }

      private removeFileFromArray(file: FileUploadModel) {
            const index = this.files.indexOf(file);
            if (index > -1) {
                  this.files.splice(index, 1);
            }
      }

}
export class FileUploadModel {
    data: File;
    state: string;
    inProgress: boolean;
    progress: number;
    canRetry: boolean;
    canCancel: boolean;
    sub?: Subscription;
}