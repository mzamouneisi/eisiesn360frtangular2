import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Consultant} from '../model/consultant';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {GenericResponse} from "../model/response/genericResponse";
import {ConsultantFilter} from '../model/ConsultantFilter';

@Injectable({providedIn:'root'})
export class ConsultantService {

  // filtres d'affichage
  public AFF_ALL: string = "ALL";
  public AFF_CONSULTANT: string = "CONSULTANT";
  public AFF_MANAGER: string = "MANAGER";
  public AFF_BOSS: string = "RESPONSIBLE_ESN";

  public LIST_FILTRES_AFF: string[] = [this.AFF_ALL, this.AFF_CONSULTANT, this.AFF_MANAGER, this.AFF_BOSS];

  private consultantUrl: string;
  private consultant: Consultant;
  private managerSelected: Consultant = null;

  public setManagerSelected(m: Consultant) {
    this.managerSelected = m;
  }

  public getManagerSelected(): Consultant {
    return this.managerSelected;
  }

  public setConsultant(consultant: Consultant) {
    this.consultant = consultant;
  }

  public getConsultant(): Consultant {
    return this.consultant;
  }

  constructor(private http: HttpClient) {
    this.consultantUrl = environment.apiUrl + '/consultant';
  }

  public findAllOfAdminUsername(adminUsername: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.consultantUrl + "findByAdminUsername" , adminUsername);
  }

  /***
   * used to retrieve all consultant for server side
   */
  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl);
  }

  /***
   * used to retrieve all admin consultant for server side
   */
  public findAdminConsultant(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl + "/admin");
  }

  /***
   * used to retrieve all NOT admin consultant for server side
   */
  public findNotAdminConsultant(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl + "/notadmin");
  }

  /***
   * used to retrieve all consultant for server side filtred by their admin
   */
  public findConsultant(admin: Consultant): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl + '/filteredByAdmin/' + admin.id);
  }

  /***
   * used to retrieve all roles from the server side
   */
  public getRoles(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl + "/roles");
  }

  /***
   * used to retrieve  consultant by id
   * @param id
   */
  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl + "/" + id);
  }

  findConsultantByUsername(username: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.consultantUrl + "/findByUsername", username);
  }

  /***
   * used to persist consultant
   * @param consultant
   */
  public save(consultant: Consultant): Observable<GenericResponse> {
    ////console.log('save id=' + consultant.id + '.');
    if (consultant.id > 0) {
      ////console.log('put update');
      return this.http.put<GenericResponse>(this.consultantUrl + "/", consultant);
    } else {
      ////console.log('post add');
      return this.savePost(consultant);
    }
  }

  /***
   * used to persist consultant with ending password
   * @param consultant
   */
  public savePost(consultant: Consultant): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.consultantUrl + "/", consultant);
  }

  /***
   * used to remove consultant by id
   * @param id
   */
  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.consultantUrl + "/" + id);
  }

  /***
   * used to remove all consultant
   */
  public deleteAll(): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.consultantUrl);
  }
}
