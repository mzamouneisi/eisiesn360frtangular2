import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {Credentials} from '../credentials';
import {Observable} from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'response'
};
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) {
  }

  public getResponseHeaders(credentials: Credentials): Observable<HttpResponse<any>> {
    
    let loginUrl = API_URL + '/login';
    return this.http.post<HttpResponse<any>>(loginUrl, credentials, httpOptions);
  }

  public logout() {
    let logoutUrl = API_URL + '/logout';
    return this.http.get(logoutUrl, {responseType: 'text'});
  }
}
