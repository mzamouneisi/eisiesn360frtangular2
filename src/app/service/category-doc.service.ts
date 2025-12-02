import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryDoc } from '../model/categoryDoc';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { GenericResponse } from '../model/response/genericResponse';
import { JsonPipe } from '@angular/common';
import { ca } from 'date-fns/locale';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class CategoryDocService {
  private categoryDocUrl: string;
  private allCategoriesDoc: CategoryDoc[] = [];
  private categoryDoc: CategoryDoc = null;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(private http: HttpClient) {
    this.categoryDocUrl = environment.apiUrl + '/categoryDoc';
  }

  public getDocCategorie(){
    return this.categoryDoc;
  }

  public setDocCategory(categoryDoc: CategoryDoc){
    this.categoryDoc = categoryDoc;
  }

  public getAllCategoriesDoc(){
    return this.allCategoriesDoc;
  }

  public setAllCategoriesDoc(categoriesDocList: CategoryDoc[]){
    this.allCategoriesDoc = categoriesDocList;
  }

  public save(category: CategoryDoc): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.categoryDocUrl, category);
  }

  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.categoryDocUrl);
  }

  public updateCategory(category: CategoryDoc): Observable<GenericResponse> {
    return this.http.put<GenericResponse>(this.categoryDocUrl, category);
  }

  public updateCategories(categories: Array<CategoryDoc>): Observable<GenericResponse> {
    return this.http.put<GenericResponse>(this.categoryDocUrl + "/", categories);
  }

}
