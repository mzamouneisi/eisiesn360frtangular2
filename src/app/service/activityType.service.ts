import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivityType } from '../model/activityType';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import {GenericResponse} from "../model/response/genericResponse";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({providedIn:'root'})
export class ActivityTypeService {

	private activityTypeUrl: string;
	private activityType:ActivityType;

	public setActivityType(activityType: ActivityType) {
		this.activityType = activityType ;
	}

	public getActivityType(): ActivityType {
		return this.activityType ;
	}

	constructor(private http: HttpClient) {
		this.activityTypeUrl = environment.apiUrl + '/activityType/';
	}

	public findAll(esnId: number): Observable<GenericResponse> {
		return this.http.get<GenericResponse>(this.activityTypeUrl + "esn-" + esnId);
	  }
	
	  public findById(id: number): Observable<GenericResponse> {
		return this.http.get<GenericResponse>(this.activityTypeUrl + id);
	  }
	
	  public save(activityType: ActivityType): Observable<GenericResponse> {
		////////////console.log("save id=" + activityType.id + ".");
		if (activityType.id > 0) {
		  ////////////console.log("put update")
		  return this.http.put<GenericResponse>(this.activityTypeUrl, activityType);
		} else {
		  ////////////console.log("post add")
		  return this.http.post<GenericResponse>(this.activityTypeUrl, activityType);
		}
	  }
	
	  public deleteById(id: number): Observable<GenericResponse> {
		return this.http.delete<GenericResponse>(this.activityTypeUrl + id);
	  }
	
	  public deleteAll(): Observable<GenericResponse> {
		return this.http.delete<GenericResponse>(this.activityTypeUrl);
	  }
}
