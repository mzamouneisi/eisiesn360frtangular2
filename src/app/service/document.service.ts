import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Document } from '../model/document';
import { GenericResponse } from '../model/response/genericResponse';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({ providedIn: 'root' })
export class DocumentService {
  private documentUrl: string;
  private document: Document;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  public setDocument(document: Document) {
    this.document = document;
  }

  public getDocument(): Document {
    return this.document;
  }

  constructor(private http: HttpClient) {
    this.documentUrl = environment.apiUrl + '/document/';
  }

  public save(document: Document): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.documentUrl, document);
  }

  public findAllByConsultant(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.documentUrl + 'ByConsultant/' + id);
  }

  public findAllByCategory(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.documentUrl + 'ByCategory/' + id);
  }

  public deleteDocument(document: Document): Observable<GenericResponse> {
    return this.http.put<GenericResponse>(this.documentUrl + "delete/"+document.id, document);
  }
}
