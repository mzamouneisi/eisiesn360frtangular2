import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

	private url: string = environment.apiUrl+'/upload/';

	constructor(private http: HttpClient) { }
  
  	upload(file: File): Observable<HttpEvent<any>> {
		    const formData: FormData = new FormData();
	
		    formData.append('file', file);
	
		    const req = new HttpRequest('POST', `${this.url}`, formData, {
		      reportProgress: true,
		      responseType: 'json'
		    });
	
		    return this.http.request(req);
	  }

	  getFiles(): Observable<any> {
		  return this.http.get(`${this.url}/files`);
	  }  
}
