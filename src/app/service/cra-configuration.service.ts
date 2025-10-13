import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {GenericResponse} from "../model/response/genericResponse";
import {CraConfiguration} from "../model/cra-configuration";

@Injectable({
  providedIn: 'root'
})
export class CraConfigurationService {

  craConfigurationUrl: string;

  constructor(private http: HttpClient) {
    this.craConfigurationUrl = environment.apiUrl + "/cra-configuration"
  }

  public getCraConfigByMonth(month: string): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.craConfigurationUrl + "/" + month);
  }

  public updateCraConfiguration(craConfiguration: CraConfiguration): Observable<GenericResponse> {
    //console.log(craConfiguration)
    if (craConfiguration.id > 0) {
      return this.http.put<GenericResponse>(this.craConfigurationUrl + "/", craConfiguration);
    } else {
      return this.http.post<GenericResponse>(this.craConfigurationUrl + "/", craConfiguration);
    }

  }
}
