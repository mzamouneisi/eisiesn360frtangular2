import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Msg } from '../model/msg';
import { Consultant } from '../model/consultant';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import {GenericResponse} from "../model/response/genericResponse";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({providedIn:'root'})
export class MsgService {

	private msgUrl: string;
	private msg:Msg;

	public setMsg(msg: Msg) {
		this.msg = msg ;
	}

	public getMsg(): Msg {
		return this.msg ;
	}

	constructor(private http: HttpClient) {
		this.msgUrl = environment.apiUrl + '/msg/';
	}

  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.msgUrl);
  }

  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.msgUrl + id);
  }

  public save(msg: Msg): Observable<GenericResponse> {
    //////////console.log("Msg service save id=" + msg.id + ".");
    if (msg.id && msg.id > 0) {
      //////////console.log("put update")
      return this.http.put<GenericResponse>(this.msgUrl, msg);
    } else {
      //////////console.log("post add")
      return this.http.post<GenericResponse>(this.msgUrl, msg);
    }
  }

  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.msgUrl + id);
  }

  public deleteAll(): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.msgUrl);
  }
  
  public findNewMsgsToConsultant(idConsultant: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.msgUrl + "to_consultant/" + idConsultant);
  }
  
}
