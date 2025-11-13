import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { FraisConsultantDashboard } from "../model/fraisConsultantDashboard";
import { FraisConsultantFilter } from "../model/fraisConsultantFilter";
import { GenericResponse } from "../model/response/genericResponse";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable()
export class NoteFraisDashboardService {
  private noteFraisDashboardUrl: string;
  private fraisConsultantDashboard: FraisConsultantDashboard;

  public setFraisConsulant(fraisConsultantDashboard: FraisConsultantDashboard) {
    this.fraisConsultantDashboard = fraisConsultantDashboard;
  }

  public getNoteFrais(): FraisConsultantDashboard {
    return this.fraisConsultantDashboard;
  }

  constructor(private http: HttpClient) {
    this.noteFraisDashboardUrl = environment.apiUrl + '/fraisConsultantDashboard/';
  }

  public getSumFeePerPeriod(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisDashboardUrl + 'perPeriod');
  }

  public getDepensesGeneral(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisDashboardUrl + 'generalDepenses');
  }

  public getAllFraisConsultantDashboard(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisDashboardUrl + 'byConsultant');
  }

  public getAllFraisActivityDashboard(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisDashboardUrl + 'byActivity');
  }

  public getAllFraisProjectDashboard(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisDashboardUrl + 'byProject');
  }

  public getAllFraisPerYearDashboard(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisDashboardUrl + 'perYear');
  }

  public getAllFraisPerMonthDashboard(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisDashboardUrl + 'perMonth');
  }

  public getAllFraisPerCategoryDashboard(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisDashboardUrl + 'perCategory');
  }

  public getAllFraisConsultantPerMonth(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisDashboardUrl + 'sumFeeConsultantPerMonth/' + id);
  }

  public getAllFraisConsultantPerYear(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisDashboardUrl + 'perYear/' + id);
  }

  public getFilteredFraisConsultantPerYear(fraisConsultantFiltred: FraisConsultantFilter): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.noteFraisDashboardUrl + "listFiltered/perYear" , fraisConsultantFiltred);
  }

  public getFilteredFraisConsultantPerMonth(fraisConsultantFiltred: FraisConsultantFilter): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.noteFraisDashboardUrl + "listFiltered/perMonth" , fraisConsultantFiltred);
  }
}
