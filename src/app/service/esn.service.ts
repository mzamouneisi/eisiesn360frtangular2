import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActivityType } from '../model/activityType';
import { Client } from '../model/client';
import { Consultant } from '../model/consultant';
import { Esn } from '../model/esn';
import { GenericResponse } from "../model/response/genericResponse";

@Injectable({ providedIn: 'root' })
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

  public refreshEsn(esn: Esn): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.esnUrl + 'refreshLists/' + esn.id);
  }

  public getListClients(esn: Esn): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.esnUrl + 'listClient/' + esn.id);
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

  ///////////////////

  majEsnOnConsultant(myObj: Consultant, fct : Function = null ) {
    // console.log("majEsnOnConsultant myObj, esnId, myObj.esn : ", myObj, myObj.esnId, myObj.esn)
    if (myObj && myObj.esnId && !myObj.esn) {
      let esnId = myObj.esnId
      let label = "find esn by id=" + esnId;
      this.findById(esnId).subscribe(
        data => {
          // console.log("setEsnOnConsultant : data :", data)
          myObj.esn = data.body != null ? data.body.result : null;
          // console.log("setEsnOnConsultant : myObj.esn :", myObj.esn)
          myObj.esnName = myObj.esn?.name
          if(fct) fct.call(myObj.esn)
        },
        error => {
          console.log("ERROR setEsnOnConsultant consultant, err", myObj, error)
        }
      );
    }
  }

  majActivityType(myObj: ActivityType) {
    ////////////////
    let id = myObj.esnId
    let label = "find esn by id=" + id;
    let obj = myObj.esn

    if (myObj && id && !obj) {
      this.findById(id).subscribe(
        data => {
          console.log(label, data)
          myObj.esn = data.body.result;
        },
        error => {
          console.log("ERROR label myObj, err", label, myObj, error)
        }
      );
    }
    /////////////////
  }

  majClient(myObj: Client) {
    ////////////////
    let id = myObj.esnId
    let label = "find esn by id=" + id;
    let obj = myObj.esn

    if (myObj && id && !obj) {
      this.findById(id).subscribe(
        data => {
          console.log(label, data)
          myObj.esn = data.body.result;
        },
        error => {
          console.log("ERROR label myObj, err", label, myObj, error)
        }
      );
    }
    ////////////////
  }

}
