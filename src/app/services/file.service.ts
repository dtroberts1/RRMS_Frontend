import {  
    Injectable  
} from '@angular/core';  
import {  
    Observable  
} from 'rxjs';  
import {  
    HttpClient,  
    HttpHeaders  
} from '@angular/common/http';  
@Injectable({  
    providedIn: 'root'  
})  
export class FileService {  
    url = 'http://localhost:64097/api/DocumentDeliveries';  
    constructor(private http: HttpClient) {}  
    public downloadFile(docFile: string): Observable < Blob > {  
        return this.http.get(this.url + '/GetFile?docFile=' + docFile, {  
            responseType: 'blob'  
        });  
    }  
    public downloadImage(image: string): Observable < Blob > {  
        return this.http.get(this.url + '/GetImage?image=' + image, {  
            responseType: 'blob'  
        });  
    }  
    public getFiles(): Observable < any[] > {  
        return this.http.get < any[] > (this.url + '/GetFileDetails');  
    }  
    AddFileDetails(data: FormData): Observable < string > {  
        // IMPORTANT !! DO NOT SET Content-Type for this!!!
        let token = JSON.parse(localStorage.getItem('user'));
        if (token != null){
          let options = {
            headers: new HttpHeaders()
            .set('Authorization', "bearer " + token),
            };
        const httpOptions = {  
            headers: options.headers  
        };  
        console.log("form is " + JSON.stringify(data.get('FileUpload')));
        return this.http.post < string > (this.url + '/DeliverAddRecordCustom', data, options);  
    }
    }  
}  