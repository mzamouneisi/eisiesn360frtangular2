import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Project } from '../model/project';
import { GenericResponse } from "../model/response/genericResponse";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({providedIn:'root'})
export class ProjetService {

	private projetUrl: string;
	private projet:Project;

	public setProjet(projet: Project) {
		this.projet = projet ;
	}

	public getProjet(): Project {
		return this.projet ;
	}

	constructor(private http: HttpClient) {
		this.projetUrl = environment.apiUrl+'/project/';
	}

	public findAll(esnId: number): Observable<GenericResponse> {
		return this.http.get<GenericResponse>(this.projetUrl+ "esn/" + esnId);
	}

	public findById(id: number): Observable<GenericResponse> {
		return this.http.get<GenericResponse>(this.projetUrl + id);
	}

	public save(projet: Project):Observable<GenericResponse> {
		////////////console.log("save id="+projet.id+".");
		if(projet.id > 0){
			////////////console.log("put update")
			return this.http.put<GenericResponse>(this.projetUrl, projet);
		} else {
			////////////console.log("post add")
			return this.http.post<GenericResponse>(this.projetUrl, projet);
		}
	}

	public deleteById(id: number): Observable<GenericResponse> {
		return this.http.delete<GenericResponse>(this.projetUrl + id);
	}

	public deleteAll(): Observable<GenericResponse> {
		return this.http.delete<GenericResponse>(this.projetUrl);
	}
}
