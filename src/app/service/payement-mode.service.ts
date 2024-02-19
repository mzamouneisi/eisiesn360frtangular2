import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {GenericResponse} from "../model/response/genericResponse";
import {PayementMode} from "../model/payementMode";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({providedIn:'root'})
export class PayementModeService {
  private payementModeUrl: string;
  private payement: PayementMode;

  public setPayementMode(payement: PayementMode) {
    this.payement = payement;
  }

  public getPayementMode(): PayementMode {
    return this.payement;
  }

  constructor(private http: HttpClient) {
    this.payementModeUrl = environment.apiUrl + '/payementMode/';
  }

  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.payementModeUrl);
  }


  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.payementModeUrl + id);
  }

  public save(payementMode: PayementMode): Observable<GenericResponse> {
    // //////////console.log("save id=" + payementMode.id + ".");
    if (payementMode.id > 0) {
      // //////////console.log("put update")
      return this.http.put<GenericResponse>(this.payementModeUrl, payementMode);
    } else {
      // //////////console.log("post add")
      return this.http.post<GenericResponse>(this.payementModeUrl, payementMode);
    }
  }

  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.payementModeUrl + id);
  }
}
