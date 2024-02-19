import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Cra} from '../model/cra';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {GenericResponse} from "../model/response/genericResponse";
import {CraDay} from "../model/cra-day";
import {CraDayActivity} from "../model/cra-day-activity";

import {UtilsService} from "./utils.service";
import {Consultant} from '../model/consultant';
import {Activity} from '../model/activity';

import {CalendarEvent} from 'angular-calendar';
import {DataSharingService} from "./data-sharing.service";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn:'root'})
export class CraService {

  craUrl: string;
  craDayUrl: string;
  craDayActivity: string;

  private cra: Cra;

  public setCra(cra: Cra) {
    this.cra = cra;
  }

  public getCra(): Cra {
    return this.cra;
  }

  constructor(private http: HttpClient, private utils: UtilsService) {
    this.craUrl = environment.apiUrl + '/cra/';
    this.craDayUrl = environment.apiUrl + "/cra-day/";
    this.craDayActivity = environment.apiUrl + "/cra-day-activity/"
  }

  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.craUrl);
  }

  /**
   * @param consultantUsername
   * @param month
   **/
  public getFilteredCra(consultantUsername: string, month: string): Observable<GenericResponse> {
    //////console.log("+++ getFilteredCra", consultantUsername, month)
    if(month == null) month = '';
    let currentUser: Consultant = DataSharingService.userConnected;
    //VALIDBYCONSULTANT
    let predicate = '';
    predicate += 'managerUsername=' + currentUser.username;
    predicate += '&consultantUsername=' + consultantUsername;
    predicate += '&validByConsultant=' + 'true';
    predicate += '&month=' + month;
    
    return this.http.get<GenericResponse>(this.craUrl + "list/filtered?" + predicate );
  }

  public getValidatedCraByConsultantAndDate(consultantUsername: string, month: string): Observable<GenericResponse> {
    //////console.log("+++ getValidatedCraByConsultantAndDate", consultantUsername, month)
    if(month == null) month = '';
    let currentUser: Consultant = DataSharingService.userConnected
    //VALIDBYCONSULTANT
    let predicate = '';
    predicate += 'consultantUsername=' + consultantUsername;
    predicate += '&validByConsultant=' + 'true';
    predicate += '&month=' + month;
    
    return this.http.get<GenericResponse>(this.craUrl + "list/filtered?" + predicate );
  }

  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.craUrl + id);
  }

  public save(cra: Cra): Observable<GenericResponse> {
    //////console.log("save cra, url", cra, this.craUrl)
    if (cra.id > 0) {
      //////console.log("save cra update")
      return this.http.put<GenericResponse>(this.craUrl, cra);
    } else {
      //////console.log("save cra add")
      return this.http.post<GenericResponse>(this.craUrl, cra);
    }
  }

  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.craUrl + id);
  }

  /***
   * call initCra in server : not a dao : just a service
   * used to init cra
   * @param date
   */
  public getNewCraOfDate(date: Date): Observable<GenericResponse> {
    ////////console.log("getCraOfDate: post craUrl, date", this.craUrl, date)
    return this.http.post<GenericResponse>(this.craUrl + "init", date);
  }

  public generatePDF(idCra:number):Observable<GenericResponse>{
    return this.http.get<GenericResponse>(this.craUrl+"generate-client-pdf/"+idCra)
  }
  public generateEsnPDF(idCra:number):Observable<GenericResponse>{
    return this.http.get<GenericResponse>(this.craUrl+"generate-esn-pdf/"+idCra)
  }

  public canAddActivity(craDay: CraDay, craDayActivity: CraDayActivity) : boolean {
    let t = craDayActivity.nbDay;
    if(!craDay.craDayActivities) {
      craDay.craDayActivities = []
    }

    craDay.craDayActivities.forEach( 
        (cda, index) => {
           t += cda.nbDay
        }
    );

    return  t <= 1;

  }


  /***
   * Used to retrieve craDay by date
   * @param cra
   * @param date
   */
  public getCraDayByDate(cra: Cra, date: Date): CraDay {
    let craDay: CraDay ;

    if (cra != null && cra.craDays != null) {
      for (let i = 0; i < cra.craDays.length; i++) {
        if (this.utils.formatDate(date) == this.utils.formatDate(cra.craDays[i].day)) {
          craDay = cra.craDays[i];
          return craDay;
        }
      }
    }
    // else {
    //   craDay = new CraDay();
    //   craDay.day = date;
    // }

    return craDay;
  }

  public setCraDayInCraByDate(cra: Cra, date: Date, craDay: CraDay, isEraseOldActivities : boolean) : boolean {
    if(cra) {
      for (let i = 0; i < cra.craDays.length; i++) {
        if (this.utils.formatDate(date) == this.utils.formatDate(cra.craDays[i].day)) {
          if(isEraseOldActivities) cra.craDays[i] = craDay;
          else {
            if(!cra.craDays[i] || !cra.craDays[i].craDayActivities || cra.craDays[i].craDayActivities.length==0) {
              cra.craDays[i] = craDay;
            }
          }
          return true;
        }
      }

    }

    return false;
  }

  /***
   * used to update element craDay in the list cra
   * @param currentCra
   * @param craDay
   */
  public updateCraDay(currentCra: Cra, craDay: CraDay): Cra {
    if (currentCra == null) {
      currentCra = new Cra();
    }
    if (currentCra.craDays == null) {
      currentCra.craDays = [];
    }
    currentCra.craDays.forEach((cd, index) => {
      if (this.utils.formatDate(craDay.day) == this.utils.formatDate(cd.day)) {
        currentCra[index] = craDay;
      }
    })
    return currentCra;
  }

  ////////////
  isCraDayOpen(craDay: CraDay): boolean {
    let ok = false;

    if(craDay) {

      if( this.utils.isDateWeekend(craDay.day) ) craDay.type = "WEEKEND";

      if (craDay.type != "WEEKEND" && craDay.type != "HOLIDAY") {
        ok = true;
      }
    }

    return ok;
  }

  /**
   craDay.dayWorked =   // true ssi ya activity and type != conge and day open
   craDay.dayBill =    // true ssi ya activity and type=mission and day open
   craDay.dayAbs =   // true ssi dayWorked=false and day open
   */
  setDayProps(craDay: CraDay) {
    //////console.log("***setDayProps: craDay", craDay)
    if (craDay != null) {
      craDay.dayWorked = false;
      craDay.dayBill = false;
      craDay.dayAbs = false;

      craDay.craDayActivities.forEach((cda, k) => {
          //////console.log("***setDayProps: cda", cda)
          let activity: Activity = cda.activity;
          if (this.isCraDayOpen(craDay) && !activity.type.congeDay) craDay.dayWorked = true;
          if (this.isCraDayOpen(craDay) && activity.type.billDay) craDay.dayBill = true;
        }
      );

      if (this.isCraDayOpen(craDay) && !craDay.dayWorked) {
        //////////console.log("***setDayProps:", craDay.day, craDay.dayWorked)
        craDay.dayAbs = true;
      }
    }
  }

  ///////////////

  /** si ya deux activies, alors nbDay = 0.5 pour les deux. */
  setNbDay(craDay: CraDay) {
    let n = craDay.craDayActivities.length;

    if (n == 1) {
      craDay.craDayActivities[0].nbDay = 1;
    } else if (n >= 2) {
      craDay.craDayActivities.forEach((cda, k) => {
          cda.nbDay = 0.5;
        }
      );
    }
  }


  //////////////////

  setEventTitle(craDay: CraDay, events: CalendarEvent[]) {
    //////////console.log("setEventTitle:", craDay, events)
    craDay.craDayActivities.forEach((cda, k) => {
        let title = UtilsService.getEventTitle(cda);
        title = title.slice(0, 25);
        let indexEvent = this.getIndexEventOfCraActivity(craDay, cda, events);
        events[indexEvent].title = title;
      }
    );
  }

  /////////

  getIndexEventOfCraActivity(craDay: CraDay, craActivity: CraDayActivity, events: CalendarEvent[]): number {
    let index = -1
    for (let i = 0; i < events.length; i++) {
      if (events[i].meta.activity.id == craActivity.activity.id
        && this.utils.formatDate(events[i].start) == this.utils.formatDate(craDay.day)
      ) {
        index = i
        break
      }
    }
    return index
  }

  ////////////////

  getCraInDate(date: Date, myList:Cra[]) : Cra {
    // console.log("getCraValidInDate date, list", date, myList)
    if(!date) return null;
    let dateMonth = this.utils.formatDateToMonth(date);
    // console.log("getCraValidInDate dateMonth", dateMonth)

    let res:Cra = null;
    if(myList) {
      for(let cra of myList) 
      {
        if(cra.type != "CONGE") {
          let dateCra = cra.month;
          // console.log("getCraValidInDate dateValide", dateValide)
          let dateCraMonth = this.utils.formatDateToMonth(dateCra);
          // console.log("getCraValidInDate dateValideMonth", dateValideMonth)
          if(dateCra && dateMonth == dateCraMonth ) {
            res = cra
            break;
          }
        }
      }
    }
    // console.log("getCraValidInDate res", res)
    return res;
  }

  ////////////////////
}

