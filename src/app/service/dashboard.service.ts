import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {GenericResponse} from "../model/response/genericResponse";
import {Notification} from "../model/notification";
import { UtilsService } from './utils.service';
import { MereComponent } from '../compo/_utils/mere-component';
import { MyError } from '../resource/MyError';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  notificationUrl: string;
  listNotifications: Notification[];
  listObserversNotifications : MereComponent[] = []
  notifInfo = "";
  notifErrors : MyError[] = []

  constructor(private http: HttpClient, private utils: UtilsService) {
    this.notificationUrl = environment.apiUrl + "/notifications";
  }

  public getListNotifications() {
    return this.listNotifications;
  }

  /***
   * used to retrieve all notification
   */
  private getNotificationsFromServer(): Observable<GenericResponse> {
    ////////console.log("getNotificationsFromServer")
    return this.http.get<GenericResponse>(this.notificationUrl);
  }

  public getNotifications() {
    let label = "loading Notifications ...";
    // console.log(label)
    this.notifyObserversNotificationsBefore(label)
    this.getNotificationsFromServer().subscribe((data) => {
      // console.log("getNotifications: this, data", this, data)
      this.listNotifications = data.body.result;
      this.notifyObserversNotificationsAfter(label, data)
    }, error => {
      // console.log("getNotifications: this, error", this, error)
      this.notifyObserversNotificationsError(label, error);
    })
  }

  public addObserverNotifications(cli: MereComponent) {
    this.listObserversNotifications.push(cli);
  }

  public notifyObserversNotificationsBefore(label) {
    for(let cli of this.listObserversNotifications) {
      if(cli) {
        cli.clearInfos()
        cli.beforeCallServer(label)
      }
    }
  }

  public notifyObserversNotificationsAfter(label, data) {
    // //console.log(label, this.listObserversNotifications)
    for(let cli of this.listObserversNotifications) {
      if(cli) {
        cli.afterCallServer(label, data)
        cli["updateNotifications"] (this.listNotifications);
      }
    }
  }

  public notifyObserversNotificationsError(label, error:MyError) {
    for(let cli of this.listObserversNotifications) {
      if(cli) {
        cli.addErrorFromErrorOfServer(label, error) ;
      }
    }
  }

  /***
   * add new notification
   */
  public addNotificationServer(notification: Notification): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.notificationUrl, notification);
  }

  addNotification(notification: Notification) {
    let label = "add notification";
    this.notifyObserversNotificationsBefore(label)
    this.addNotificationServer(notification).subscribe((data) => {
      // this.notifyObserversNotificationsAfter(label, data)
      this.getNotifications()
    }, error => {
      this.notifyObserversNotificationsError(label, error);
    })
  }

  /***
   * used to update notification
   * @param notification
   */
  public saveNotificationServer(notification: Notification): Observable<GenericResponse> {
    return this.http.put<GenericResponse>(this.notificationUrl, notification);
  }

  saveNotification(notification: Notification) {
    let label = "save notification";
    this.notifyObserversNotificationsBefore(label)
    this.saveNotificationServer(notification).subscribe((data) => {
      // this.notifyObserversNotificationsAfter(label, data)
      this.getNotifications()
    }, error => {
      this.notifyObserversNotificationsError(label, error);
    })
  }

  /***
   * used to delete notification
   * @param id
   */
  public deleteNotificationServer(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.notificationUrl + "/deleteById/" + id);
  }

  deleteNotification(id: number) {
    let label = "delete notification id=" + id;
    this.notifyObserversNotificationsBefore(label)
    this.deleteNotificationServer(id).subscribe((data) => {
      // this.notifyObserversNotificationsAfter(label, data)
      this.getNotifications()
    }, error => {
      this.notifyObserversNotificationsError(label, error);
    })
  }

  public getNotificationNettoyee(notification: Notification): Notification { 

    notification.createdDate = this.utils.getDate(notification.createdDate);

    return notification;

  }


}
