import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Category} from '../model/category';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {GenericResponse} from '../model/response/genericResponse';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({providedIn:'root'})
export class CategoryService {
  private categoryUrl: string;
  private category: Category;

  public setCategory(category: Category) {
    this.category = category;
  }

  public getCategorie(): Category {
    return this.category;
  }

  constructor(private http: HttpClient) {
    this.categoryUrl = environment.apiUrl + '/category/';
  }

  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.categoryUrl);
  }


  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.categoryUrl + id);
  }

  public save(category: Category): Observable<GenericResponse> {
    // //////////console.log("save id=" + category.id + ".");
    if (category.id > 0) {
      // //////////console.log("put update")
      return this.http.put<GenericResponse>(this.categoryUrl, category);
    } else {
      // //////////console.log("post add")
      return this.http.post<GenericResponse>(this.categoryUrl, category);
    }
  }

  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.categoryUrl + id);
  }

}
