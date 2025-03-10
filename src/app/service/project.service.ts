import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Activity } from '../model/activity';
import { Client } from '../model/client';
import { Project } from '../model/project';
import { GenericResponse } from "../model/response/genericResponse";

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class ProjectService {

	private projectUrl: string;
	private project: Project;

	public setProject(project: Project) {
		this.project = project;
	}

	public getProject(): Project {
		return this.project;
	}

	constructor(private http: HttpClient) {
		this.projectUrl = environment.apiUrl + '/project/';
	}

	public findAll(esnId: number): Observable<GenericResponse> {
		if(esnId == null) esnId = 0;
		console.log("findAll projects of esnId : ", esnId);
		return this.http.get<GenericResponse>(this.projectUrl + "esn/" + esnId);
	}

	public findById(id: number): Observable<GenericResponse> {
		return this.http.get<GenericResponse>(this.projectUrl + id);
	}

	public getProjectsOfClient(cli: Client): Observable<GenericResponse> {
		return this.http.get<GenericResponse>(this.projectUrl + 'findAllByClientId/' + cli.id);
	}

	public save(project: Project): Observable<GenericResponse> {
		////////////console.log("save id="+project.id+".");
		if (project.id > 0) {
			////////////console.log("put update")
			return this.http.put<GenericResponse>(this.projectUrl, project);
		} else {
			////////////console.log("post add")
			return this.http.post<GenericResponse>(this.projectUrl, project);
		}
	}

	public deleteById(id: number): Observable<GenericResponse> {
		console.log("delete project : " + this.projectUrl + id)
		return this.http.delete<GenericResponse>(this.projectUrl + id);
	}

	public deleteAll(): Observable<GenericResponse> {
		return this.http.delete<GenericResponse>(this.projectUrl);
	}

	//////////////

	majActivity(myObj: Activity) {
		////////////////
		let id = myObj.projectId
		let label = "find project by id=" + id;
		let obj = myObj.project

		console.log("majActivity id, myObj, obj : " , id, myObj, obj)

		if (myObj && id && !obj) {
			this.findById(id).subscribe(
				data => {
					console.log(label, data)
					myObj.project = data.body.result;
				},
				error => {
					console.log("ERROR label myObj, err", label, myObj, error)
				}
			);
		}
		/////////////////
	}
}
