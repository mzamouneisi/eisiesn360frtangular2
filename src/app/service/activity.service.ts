import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Activity} from '../model/activity';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {GenericResponse} from '../model/response/genericResponse';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Consultant} from '../model/consultant';
import {UtilsService} from './utils.service';
import {DataSharingService} from './data-sharing.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn:'root'})
export class ActivityService {

  private activityUrl: string;
  private activity: Activity;

  public setActivity(activity: Activity) {
    this.activity = activity;
  }

  public getActivity(): Activity {
    return this.activity;
  }

  constructor(private http: HttpClient, private utils: UtilsService) {
    this.activityUrl = environment.apiUrl + '/activity/';
  }

  public findAllByConsultant(idConsultant : number): Observable<GenericResponse> {
	  let url = this.activityUrl + "all";
	  if(idConsultant > 0) url = this.activityUrl + "idConsultant/"+ idConsultant;
    return this.http.get<GenericResponse>(url);
  }


  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.activityUrl + 'all');
  }


  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.activityUrl + id);
  }

  public save(activity: Activity): Observable<GenericResponse> {
    ////////////console.log("save id=" + activity.id + ".");
    if (activity.id > 0) {
      ////////////console.log("put update")
      return this.http.put<GenericResponse>(this.activityUrl, activity);
    } else {
      ////////////console.log("post add")
      return this.http.post<GenericResponse>(this.activityUrl, activity);
    }
  }

  public addMultipleActivity(activities: Activity[]): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.activityUrl + "addMultipleActivity", activities);
  }

  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.activityUrl + id);
  }

  public deleteAll(): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.activityUrl);
  }

  public getFilteredActivity(consultantUsername: string): Observable<GenericResponse> {
    const currentUser: Consultant = DataSharingService.userConnected
    return this.http.get<GenericResponse>(this.activityUrl + 'list/filtered?createdByUsername=' + currentUser.username + '&consultant.username=' + consultantUsername);
  }
}
