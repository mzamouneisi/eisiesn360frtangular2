import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {GenericResponse} from '../model/response/genericResponse';
import {NoteFrais} from '../model/noteFrais';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({providedIn:'root'})
export class NoteFraisService {
  private noteFraisUrl: string;
  private noteFrais: NoteFrais;
  private extractUrl: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  public setNoteFrais(noteFrais: NoteFrais) {
    this.noteFrais = noteFrais;
  }

  public getNoteFrais(): NoteFrais {
    return this.noteFrais;
  }

  constructor(private http: HttpClient) {
    this.noteFraisUrl = environment.apiUrl + '/noteFrais/';
  }

  public findAllByConsultant(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisUrl + 'ByConsultant/' + id);
  }


  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisUrl );
  }

  public save(noteFrais: NoteFrais): Observable<GenericResponse> {
    // //////////console.log("save id=" + noteFrais.id + ".");
    if (noteFrais.id > 0) {
      // //////////console.log("put update")
      return this.http.put<GenericResponse>(this.noteFraisUrl, noteFrais);
    } else {
      // //////////console.log("post add")
      return this.http.post<GenericResponse>(this.noteFraisUrl, noteFrais);
    }
  }

  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.noteFraisUrl + id);
  }

  public getConfig(data): Observable<any> {
    return this.http.get(this.extractUrl + data, this.httpOptions);
  }

}
