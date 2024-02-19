import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Esn} from '../model/esn';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {GenericResponse} from "../model/response/genericResponse";

@Injectable({providedIn:'root'})
export class EsnService {

  private esnUrl: string;
  private esn: Esn;
  public setEsn(esn: Esn) {
    this.esn = esn;
  }

  public getEsn(): Esn {
    return this.esn;
  }

  constructor(private http: HttpClient) {
    this.esnUrl = environment.apiUrl + '/esn/';
  }

  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.esnUrl);
  }

  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.esnUrl + id);
  }

  public save(esn: Esn): Observable<GenericResponse> {
    ////////////console.log("save id=" + esn.id + ".");
    if (esn.id > 0) {
      ////////////console.log("put update")
      return this.http.put<GenericResponse>(this.esnUrl, esn);
    } else {
      ////////////console.log("post add")
      return this.http.post<GenericResponse>(this.esnUrl, esn);
    }
  }

  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.esnUrl + id);
  }

  public deleteAll(): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.esnUrl);
  }

  public addEsnDemo(): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.esnUrl + "demo", "demo");
  }
}
