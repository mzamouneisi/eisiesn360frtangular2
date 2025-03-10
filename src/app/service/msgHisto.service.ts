import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MsgHisto } from '../model/msgHisto';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import {GenericResponse} from "../model/response/genericResponse";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({providedIn:'root'})
export class MsgHistoService {

	private msgHistoUrl: string;
	private msgHisto:MsgHisto;

	public setMsgHisto(msgHisto: MsgHisto) {
		this.msgHisto = msgHisto ;
	}

	public getMsgHisto(): MsgHisto {
		return this.msgHisto ;
	}

	constructor(private http: HttpClient) {
		this.msgHistoUrl = environment.apiUrl + '/msgHisto/';
	}

  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.msgHistoUrl);
  }

  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.msgHistoUrl + id);
  }

  public save(msgHisto: MsgHisto): Observable<GenericResponse> {
    ////////////console.log("save id=" + msgHisto.id + ".");
    if (msgHisto.id > 0) {
      ////////////console.log("put update")
      return this.http.put<GenericResponse>(this.msgHistoUrl, msgHisto);
    } else {
      ////////////console.log("post add")
      return this.http.post<GenericResponse>(this.msgHistoUrl, msgHisto);
    }
  }

  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.msgHistoUrl + id);
  }

  public deleteAll(): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.msgHistoUrl);
  }	
}
