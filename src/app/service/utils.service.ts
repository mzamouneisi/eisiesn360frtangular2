import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MyError } from '../resource/MyError';
// import {NotifierService} from "angular-notifier";
import { Router } from '@angular/router';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IMyDpOptions } from "mydatepicker";
import { CraDayActivity } from "../model/cra-day-activity";
import { TradService } from './trad.service';

const formatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  static readonly TOKEN_STORAGE_KEY = 'token';
  static readonly TOKEN_STORAGE_USER = 'user';
  static readonly TOKEN_STORAGE_USER_CONNECTED = 'user_connected';
  /****** PATTERNS INPUT ***********/
  static readonly EMAIL_PATTERN = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  static readonly TEL_PATTERN = "^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"; //   ^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$  // ^0[1-9][0-9]{8}$
  /******               ************/
  static readonly DEFAULT_LOCALE = navigator.language.substr(0, 2);
  static readonly myDatePickerOptions: IMyDpOptions = { dateFormat: 'yyyy-mm-dd' };

  static readonly TOKEN_STORAGE_KEY_LAST_USERNAME = 'lastUsername';

  error: string;
  // private readonly notifier: NotifierService;

  constructor(
    // notifier: NotifierService
    private tradService: TradService
    , private router: Router
  ) {
    // this.notifier = notifier;
  }

  public tr(cle: string, paramJson: Object = null): string {
    return this.tradService.get(cle, paramJson);
  }
  public setLang(l: string) {
    this.tradService.setLang(l);
  }
  public getLang(): string {
    return this.tradService.getLang();
  }

  public setError(error: string) {
    this.error = error;
  }

  public getError(): string {
    return this.error
  }

  /***
   * used to find the index of the object in array
   * @param tab
   * @param id
   */
  private getObjectIndex(tab: any, id: number): number {
    for (let i = 0; i < tab.length; i++) {
      if (tab[i].id == id) return i;
    }
    return -1;
  }

  /***
   * used to find the index of the object in array
   * @param tab
   * @param id
   */
  private getObjectIndexByValue(tab: any, value: any): number {

    for (let i = 0; i < tab.length; i++) {
      if (tab[i] == value) return i;
    }
    return -1;
  }

  /***
   * used to get from group for input select
   * @param fb
   * @param data
   * @param id
   * @param value
   */
  public getFormGroup(fb: FormBuilder, data: any[], id: number, value: any, controllerName: string, isDatasWithId: boolean = true): FormGroup {
    let formGroup!: FormGroup;
    ////////////console.log("getFormGroup:")
    ////console.log(value)
    ////console.log(data)
    ////console.log(id)
    if (value != undefined) {
      let indexSelected = id;
      if (isDatasWithId) indexSelected = this.getObjectIndex(data, id);
      ////console.log(indexSelected)
      formGroup = fb.group(
        {
          [controllerName]: [indexSelected]
        }
      );
    }
    return formGroup;
  }

  /***
   * used to get from group for input select
   * @param fb
   * @param data
   * @param id
   * @param value
   */
  public getFormGroupForString(fb: FormBuilder, data: any[], value: any, controllerName: string): FormGroup {
    let formGroup!: FormGroup;
    if (value != undefined) {
      let indexSelected = this.getObjectIndexByValue(data, value);
      ////////////console.log("*********** index :" + indexSelected);
      formGroup = fb.group(
        {
          [controllerName]: [indexSelected]
        }
      );
    }
    return formGroup;
  }

  ////////////////////////////////////////////

  getNumberInMin2Digits(n: string): string {
    if (!n) return "";

    let res = n;
    if (n.length < 2) res = '0' + n;

    return res;
  }

  /**
   * 
   * @param amount 
   * @returns arrondi a 2 digits 
   */
  round(amount: number): number {
    let s = formatter.format(amount)
    return parseFloat(s.replace(/\s/g, '').replace(',', '.'));
  }

  //////////////// dates ////////////////////

  setTime0ToDate(date: Date): Date {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setUTCMilliseconds(0)
    return date;
  }

  getDateYesterday(): Date {
    let now = new Date();
    let prec = new Date();
    prec.setDate(now.getDate() - 1);

    prec = this.setTime0ToDate(prec)

    return prec;
  }

  getDateLastMonthFirstDay(): Date {
    let now = new Date();
    let prec = new Date();
    prec.setDate(1);
    prec.setMonth(now.getMonth() - 1)
    if (now.getMonth() < 11) prec.setFullYear(now.getFullYear())
    else prec.setFullYear(now.getFullYear() - 1)

    prec = this.setTime0ToDate(prec)

    return prec;
  }

  formatDateToDateHeure(date: Date): string {
    if (!date) return "";

    let d: Date = this.getDate(date);

    let month = this.getNumberInMin2Digits((d.getMonth() + 1) + ""),
      day = this.getNumberInMin2Digits(d.getDate() + ""),
      year = d.getFullYear(),
      hour = this.getNumberInMin2Digits(d.getHours() + ""),
      min = this.getNumberInMin2Digits(d.getMinutes() + ""),
      sec = this.getNumberInMin2Digits(d.getSeconds() + "")
      ;

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    let res = [day, month, year].join('/') + ' ' + [hour, min, sec].join(':');
    ////////////console.log("res:")
    ////console.log(res)
    return res;
  }

  getDateNow() {
    let d: Date = new Date();

    let month = this.getNumberInMin2Digits((d.getMonth() + 1) + ""),
      day = this.getNumberInMin2Digits(d.getDate() + ""),
      year = d.getFullYear(),
      hour = this.getNumberInMin2Digits(d.getHours() + ""),
      min = this.getNumberInMin2Digits(d.getMinutes() + ""),
      sec = this.getNumberInMin2Digits(d.getSeconds() + "")
      ;

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    let res = [year, month, day].join('_') + '_' + [hour, min, sec].join('_');
    ////////////console.log("res:")
    ////console.log(res)
    return res;
  }

  public isDateWeekend(date: Date): boolean {
    date = this.getDate(date);
    let dayOfWeek = date.getDay();
    let isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0); // 6 = Saturday, 0 = Sunday
    return isWeekend;
  }

  /***
 * Used to format date to yyyy-MM
 * @param date
 */
  public formatDateToMonth(date: any): string {

    if (!date) return "";

    ////////////console.log("formatDate:")
    ////console.log(date)

    let d: Date = this.getDate(date);

    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    let res = [year, month].join('-');
    ////////////console.log("res:")
    ////console.log(res)
    return res;
  }

  /***
   * Used to format date to yyyy-MM-dd
   * @param date
   */
  public formatDate(date: any, lang = "FR"): string {

    if (!date) return "";

    ////////////console.log("formatDate:")
    ////console.log(date)

    if (!lang) lang = "FR"

    lang = lang.toUpperCase();

    let d: Date = this.getDate(date);

    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    let res = "";
    if (lang == "FR") {
      res = [day, month, year].join('/');
    } else {
      res = [year, month, day].join('-');
    }
    ////////////console.log("res:")
    ////console.log(res)
    return res;
  }

  /**
   * 
   * @param isoDate : 2024-07-31T22:00:00.000+00:00
   */
  public convertDateIso8601ToFr(isoDate: Date) {
    // Création d'un objet Date à partir de la chaîne ISO
    const date = new Date(isoDate);

    // Formatage de la date en français
    const formattedDate = format(date, 'PPPPpppp', { locale: fr });

    return formattedDate;
  }

  public convertToDate(dateStr: string): Date {
    return parse(dateStr, "dd MMMM yyyy", new Date(), { locale: fr });
  }

  public convertToDateTiret(dateStr: string): Date {
    return parse(dateStr, "dd-MM-yyyy HH:mm:ss", new Date(), { locale: fr });
  }

  public getErrorFromResultOfServer(data: any): MyError {
    //////console.log("getErrorFromResultOfServer: data", data)
    let error!: MyError;
    if (data != null && data.header != null) {
      let errorMsg = data.header.errorMsg
      //////console.log("getErrorFromResultOfServer: errorMsg", errorMsg)
      if (errorMsg) {
        error = new MyError(errorMsg, data.header.description);
        error.providerCode = data.header.providerCode;
        error.providerDescription = data.header.providerDescription;
        error.statusCode = data.header.statusCode;
      }
    }
    //////console.log("getErrorFromResultOfServer: error", error)
    return error
  }

  public getErrorFromErrorOfServer(err: any): MyError {
    console.log("getErrorFromErrorOfServer: err", err)
    let error!: MyError;
    let msg = "";
    if (err) {
      msg = (err.error != null && err.error.message != null) ? err.error.message : err.message;
      console.log("getErrorFromErrorOfServer: msg", msg)
      if (msg) {
        error = new MyError("Error", msg);
      } else {
        msg = err.msg;
        if (msg) {
          let title = err.title ? err.title : "Error";
          error = new MyError(title, msg);
        }
      }
    }
    return error
  }


  /***
   * Used to get activity title
   * @param craActivity
   */
  static getEventTitle(craActivity: CraDayActivity) {
    let title = "";
    let name = craActivity.activity.name
    // let proj = '/' + craActivity.activity.clientName
    // name = name + proj 
    if (craActivity.isOverTime) title = '(' + craActivity.startHour + '-' + craActivity.endHour + ') ' + name;
    else title = craActivity.nbDay + ' ' + name;
    return title;
  }

  /**
   * Show a notification
   *
   * @param {string} type    Notification type
   * @param {string} message Notification message
   */
  public showNotification(type: NotificationType, message: string): void {
    //this.notifier.notify(type, message);
    // console.log("TODO showNotification", type, message);
  }

  /**
 * Show a notification success or error
 *
 * @param {any} error    objet error
 */
  public showNotifSuccessOrError(error: any): void {
    if (!this.getError()) this.showNotification("success", "completed successfully");
    else this.showNotification("error", error.msg);
  }

  public getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /***
   * This method used to get locale language
   */
  public getLocale(): string {
    let locale = localStorage.getItem("locale");
    if (locale != null && locale != undefined) return locale;
    return UtilsService.DEFAULT_LOCALE;

  }

  /***
   *
   * @param body
   */
  public getTextByLocale(body: any): string {
    let obj = JSON.parse(JSON.stringify(body));
    let locale = this.getLocale();
    if (locale == "en")
      return obj.en;
    if (locale == "fr")
      return obj.fr;
    return "";
  }

  public getNbJourBetweenDates(date1: Date, date2: Date): number {

    date1 = this.getDate(date1);
    date2 = this.getDate(date2);

    let diffMs = date2.getTime() - date1.getTime();
    let diffJours = diffMs / (1000 * 3600 * 24);

    return diffJours;
  }

  public getDatePlusNbJour(dateDeb: Date, i): Date {

    if (i == 0) return dateDeb;

    return new Date(dateDeb.getTime() + i * 1000 * 3600 * 24);

  }

  /**
 * 
 * @param s yyyy-mm-dd
 * @returns array y, m, d
 */
  public getArrayOfDateFromStrYYYYMMDD(s: string, isMonthIndex: boolean = false) {
    let arr = [0, 0, 0];
    let one = isMonthIndex ? 1 : 0;

    let tab = s.split("-");
    if (tab.length == 3) {
      let y = 0, m = 0, d = 0;

      if (tab[0].length == 4) y = parseInt(tab[0]); else throw "date string. year not in format yyyy. d=" + s;
      if (tab[1].length == 2) m = parseInt(tab[1]) - one; else throw "date string. month not in format mm. d=" + s;
      if (tab[2].length == 2) d = parseInt(tab[2]); else throw "date string. day not in format dd. d=" + s;

      // ////////console.log("getDate: y, m, d: ", y, m, d)

      arr = [y, m, d];
    } else {
      throw "getArrayOfDateFromStrYYYYMMDD: date string not in format yyyy-mm-dd. d=" + s;
    }
    return arr;
  }

  /**
   * 
   * @param s yyyy-mm-dd
   */
  public getDateFromStrYYYYMMDD(s: string, isMonthIndex: boolean = false): Date {
    let date: Date = null;
    let arr = this.getArrayOfDateFromStrYYYYMMDD(s, isMonthIndex);
    if (arr[0] != 0) {
      date = new Date(arr[0], arr[1], arr[2])
    }
    return date;
  }

  /**
   * 
   * @param s : 22:00:00.000Z
   * @returns Array : HH, MM, SS
   */
  public getArrayTimeFromHHMMSS(s: string) {
    let arr = [0, 0, 0];

    let tab = s.split(".")[0].split(":");
    if (tab.length == 3) {
      let h = 0, m = 0, ss = 0;

      if (tab[0].length == 2) h = parseInt(tab[0]); else throw "getTimeFromHHMMSS: hour not in format hh. d=" + s;
      if (tab[1].length == 2) m = parseInt(tab[1]) - 1; else throw "getTimeFromHHMMSS: min not in format mm. d=" + s;
      if (tab[2].length == 2) ss = parseInt(tab[2]); else throw "getTimeFromHHMMSS: sec not in format ss. d=" + s;

      // ////////console.log("getDate: y, m, d: ", y, m, d)

      arr[0] = h; arr[1] = m; arr[2] = ss;
    } else {
      throw "getArrayTimeFromHHMMSS: time string not in format 22:00:00. d=" + s;
    }
    return arr;
  }

  public getDate(d: any) {

    // ////////console.log("getDate: d: ", d)
    // ////////console.log("getDate: json: ", JSON.stringify(d))

    if (!d) return null;
    else if (d instanceof Date) return d;
    else if (d.date instanceof Date) return d.date;

    var date: Date;

    if (typeof d == "string") {
      // 2021-06-28T15:36:21.977+0000
      d = d.replace('"', '')
      date = new Date(d)

    } else {
      // ////////console.log("getDate: NOT string: ", d)
      throw "getDate: NOT string and NOT DATE !!!: d=" + d;
    }

    // ////////console.log("getDate: res: ", date)

    return date;
  }

  public getDateToDebug(d: any) {

    // ////////console.log("getDate: d: ", d)
    // ////////console.log("getDate: json: ", JSON.stringify(d))

    var date: Date;

    let isInstOfDate = d instanceof Date;
    // ////////console.log("getDate: myInstOfDate: ", myInstOfDate)

    if (typeof d == "string") {
      // 2021-06-28T15:36:21.977+0000
      d = d.replace('"', '')
      // ////////console.log("getDate: string: ", d)

      let tab = []
      let date1: Date;

      if (d.indexOf('T') >= 0) { // "2021-08-31T22:00:00.000Z"
        tab = d.split("T");
        date = this.getDateFromStrYYYYMMDD(tab[0]);
        let arr = this.getArrayTimeFromHHMMSS(tab[1])
        date.setHours(arr[0])
        date.setMinutes(arr[1])
        date.setSeconds(arr[2])
      } else { //"2021-08-31"
        date = this.getDateFromStrYYYYMMDD(d, false);
      }

    } else {
      // ////////console.log("getDate: NOT string: ", d)
      if (isInstOfDate) date = d;
      else {
        throw "getDate: NOT string and NOT DATE !!!: d=" + d;
      }
    }

    // ////////console.log("getDate: res: ", date)

    return date;
  }

  public getWeekNumber(date: any): number {
    // //////////console.log("getWeekNumber: date: ", date)
    var n = 0;
    if (date) {
      date = this.getDate(date)
      var date2 = new Date(date.getTime());
      date2.setHours(0, 0, 0, 0);
      // Thursday in current week decides the year.
      date2.setDate(date2.getDate() + 3 - (date2.getDay() + 6) % 7);
      // January 4 is always in week 1.
      var week1 = new Date(date2.getFullYear(), 0, 4);
      // Adjust to Thursday in week 1 and count number of weeks from date to week1.
      n = 1 + Math.round(((date2.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);

    }
    // //////////console.log("getWeekNumber: n: ", n)
    return n;
  }

  getLastDay(y: number, m: number) {
    return new Date(y, m + 1, 0).getDate();
  }

  getLastDayOfMonth(date: Date) {
    date = this.getDate(date)
    var y = date.getFullYear();
    var m = date.getMonth();  // 0-11
    return this.getLastDay(y, m);
  }

  getLastDaysOfYear(y: number) {
    var lasts = []
    for (var m = 0; m < 12; m++) {
      lasts.push(this.getLastDay(y, m));
    }
    return lasts;
  }

  public getWeekNumbersOfMonth(date: Date) {

    // //////////console.log("**** getWeekNumbersOfMonth deb " , date);

    if (!date) return [];

    date = this.getDate(date)

    var date1 = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    var dateLast = new Date(date.getFullYear(), date.getMonth(), this.getLastDayOfMonth(date), 0, 0, 0, 0);

    var w1 = this.getWeekNumber(date1);
    var wLast = this.getWeekNumber(dateLast);
    var tab = [];
    for (var w = w1; w <= wLast; w++) {
      tab.push(w);
    }

    // //////////console.log("**** getWeekNumbersOfMonth fin " , tab);

    return tab;
  }

  /**
   * 
   * @param myList 
   * @param searchStr 
   * @param cols 
   * @returns 
   */
  search(myList: any[], searchStr: string, cols: string[] = null): any[] {

    if (!myList || !searchStr) return myList;

    searchStr = searchStr.toLowerCase();

    let list = []

    // console.log("searchStr : ", searchStr )
    for (let el of myList) {
      let s = "";
      if (cols == null || cols.length == 0) {
        s = JSON.stringify(el);
      } else {
        for (var c of cols) {
          s += JSON.stringify(el[c]) + ",";
        }
      }
      s = s.toLowerCase()
      if (s.includes(searchStr)) {
        // console.log("s contains : searchStr : ", s )
        list.push(el)
      }
    }

    return list;
  }

  /////////

  navigateToUrl(url: string, objParam: Object = null) {
    if (!objParam) objParam = {}
    if (!url) url = "/";

    this.router.navigate([url], { queryParams: objParam });
  }

  ///////////

  isEmpty(obj: Object) {
    return obj == null || obj == "" || obj == "null";
  }

  generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }

  // end methodes ////////////


} //////////// END Class //////////////////////

export type NotificationType = 'default' | 'info' | 'success' | 'warning' | 'error';
