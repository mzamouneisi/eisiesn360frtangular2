import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Client } from '../model/client';
import { Project } from '../model/project';
import { GenericResponse } from "../model/response/genericResponse";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn:'root'})
export class ClientService {

  private clientUrl: string;
  private client: Client;

  public setClient(client: Client) {
    this.client = client;
  }

  public getClient(): Client {
    return this.client;
  }

  constructor(private http: HttpClient) {
    this.clientUrl = environment.apiUrl + '/client/';
  }

  public findAll(esnId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.clientUrl + "esn/" + esnId);
  }

  public findAllAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.clientUrl );
  }

  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.clientUrl + id);
  }

  public save(client: Client): Observable<GenericResponse> {
    ////////////console.log("save id=" + client.id + ".");
    if (client.id > 0) {
      ////////////console.log("put update")
      return this.http.put<GenericResponse>(this.clientUrl, client);
    } else {
      ////////////console.log("post add")
      return this.http.post<GenericResponse>(this.clientUrl, client);
    }
  }

  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.clientUrl + id);
  }

  public deleteAll(): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.clientUrl);
  }

  ////////////////////////////////////////////////////////////////

  majProject(myObj: Project) {
    ////////////////
    let clientId = myObj?.client?.id
    let label = "find client by id=" + clientId;
    let obj = myObj.client

    if (myObj && clientId && !obj) {
      this.findById(clientId).subscribe(
        data => {
          console.log(label, data)
          myObj.client = data.body.result;
        },
        error => {
          console.log("ERROR label myObj, err", label, myObj, error)
        }
      );
    }
    /////////////////
  }
}
