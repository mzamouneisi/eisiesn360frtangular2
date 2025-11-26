import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NoteFrais } from '../model/noteFrais';
import { Notification } from '../model/notification';
import { GenericResponse } from '../model/response/genericResponse';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({providedIn:'root'})
export class NoteFraisService {

  private noteFraisUrl: string;
  private noteFrais: NoteFrais;
  private extractUrl: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  public setNoteFrais(noteFrais: NoteFrais) {
    this.noteFrais = noteFrais;
  }

  public getNoteFrais(): NoteFrais {
    return this.noteFrais;
  }

  constructor(private http: HttpClient) {
    this.noteFraisUrl = environment.apiUrl + '/noteFrais/';
  }

  public findAllByConsultant(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisUrl + 'ByConsultant/' + id);
  }


  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisUrl );
  }

  public save(noteFrais: NoteFrais): Observable<GenericResponse> {
    // //////////console.log("save id=" + noteFrais.id + ".");
    if (noteFrais.id > 0) {
      // //////////console.log("put update")
      return this.http.put<GenericResponse>(this.noteFraisUrl, noteFrais);
    } else {
      // //////////console.log("post add")
      return this.http.post<GenericResponse>(this.noteFraisUrl, noteFrais);
    }
  }

  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.noteFraisUrl + id);
  }

  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.noteFraisUrl + id);
  }

  public getConfig(data): Observable<any> {
    return this.http.get(this.extractUrl + data, this.httpOptions);
  }

  ///////////////////////////////////////////////////////////////////

  majNotification(myObj: Notification, fct : Function = null ) {
	    ////////////////
      let id = myObj.noteFraisId
      let label = "find noteFrais by id="+id;
      let obj = myObj.noteFrais
    
      if(myObj && id && !obj ) {
        this.findById(id).subscribe(
        data => {
          console.log(label, data)
          myObj.noteFrais = data.body.result;
          if(fct) fct()
        },
        error => {
          console.log("ERROR label myObj, err", label, myObj, error )
        }
        );
      }else {
        if(fct) fct()
      }
      ////////////////
  }

}
