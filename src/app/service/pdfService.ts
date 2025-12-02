import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericResponse } from '../model/response/genericResponse';
import { DataSharingService } from './data-sharing.service';
import { UtilsService } from './utils.service';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn:'root'})
export class PdfService {

  private myUrl: string;

  constructor(private http: HttpClient, private utils: UtilsService, private dataSharingService : DataSharingService) {
    this.myUrl = environment.apiUrl + '/pdf/';
  }

    // public getNewCraOfDate(date: Date): Observable<GenericResponse> {
    //   ////////console.log("getCraOfDate: post craUrl, date", this.craUrl, date)
    //   return this.http.post<GenericResponse>(this.myUrl + "init", date);
    // }

    uploadPdf(file: File): Observable<GenericResponse> {
    const formData = new FormData();
    formData.append('file', file);

    console.log("formData : ", formData)

    return this.http.post<GenericResponse>(this.myUrl + "upload", formData);
  }

  uploadPdf00(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    console.log("formData : ", formData)

    return this.http.post<string>(this.myUrl + "upload", formData)

    // return this.http.post<string>(this.myUrl + "upload", formData).pipe(
    //   catchError(this.handleError)
    // );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error uploading file:', error);
    return throwError(() => new Error('File upload failed. Please try again.'));
  }

}
