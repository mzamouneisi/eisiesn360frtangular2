import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from '../../environments/environment';
import { GenericResponse } from "../model/response/genericResponse";

@Injectable({ providedIn: 'root' })
export class ConnectionService {
    private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + '/connections/';
  }

  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.apiUrl);
  }
}
