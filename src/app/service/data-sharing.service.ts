import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from "rxjs";
import { Credentials } from '../auth/credentials';
import { TokenService } from '../auth/services/token.service';
import { MereComponent } from '../compo/_utils/mere-component';
import { CraStateService, ServiceLocator } from "../core/core";
import { CraContext } from "../core/model/cra-context";
import { HeaderComponent } from '../layout/header/header.component';
import { Activity } from '../model/activity';
import { ActivityType } from '../model/activityType';
import { Consultant } from "../model/consultant";
import { Cra } from '../model/cra';
import { CraDayActivity } from '../model/cra-day-activity';
import { NoteFrais } from '../model/noteFrais';
import { Project } from '../model/project';
import { MyError } from '../resource/MyError';
import { ActivityService } from './activity.service';
import { ConsultantService } from './consultant.service';
// 
import { UtilsService } from "./utils.service";
// import { CraService } from './cra.service';

import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Esn } from '../model/esn';
import { Mail } from '../model/Mail';
import { Notification } from "../model/notification";
import { GenericResponse } from "../model/response/genericResponse";
import { ClientService } from './client.service';
import { CraService } from './cra.service';
import { EsnService } from './esn.service';
import { MsgService } from './msg.service';
import { UtilsIhmService } from './utilsIhm.service';


/**
 * Copyright (C) 2020-@year@ by Eisi Cnsulting.
 * All rights reserved.
 *
 * Eisi Headquarters:
 * 6 RUE DES DEUX COMMUNES
 * 91480 QUINCY SOUS SENART

 * Created at 18/04/2020 19:15
 * @author Saber Ben Khalifa <saber.khalifa@eisi-consulting.fr>
 **/

const URL_FRONT = "https://mzamouneisi.github.io/eisiesn360frtangular2"

@Injectable({
  providedIn: 'root'
})
export class DataSharingService implements CraStateService, ServiceLocator {

  headerComponent: HeaderComponent;

  // public static currentUser: BehaviorSubject<Consultant> = new BehaviorSubject<Consultant>(new Consultant());
  craContext: BehaviorSubject<CraContext> = new BehaviorSubject<CraContext>(null);
  public serviceRegistry: Map<string, any> = new Map<string, any>();
  public userSelectedActivity: Consultant;

  private infosSource = new BehaviorSubject<string[]>([]);
  private errorsSource = new BehaviorSubject<MyError[]>([]);

  infos$ = this.infosSource.asObservable();
  errors$ = this.errorsSource.asObservable();

  // listInfos: Array<string> = [];
  // listErrors: MyError[] = [];
  // listInfosObservers: MereComponent[] = [];
  listCra: Cra[];
  isAdd: string;
  typeCra: string;
  currentCra: Cra;
  currentFee: NoteFrais;
  fromNotif: boolean;
  isDisableSearchStrInput: boolean = false;
  activityTypes: ActivityType[];
  projects: Project[];

  redirectToUrl: string = '';
  authorization: string;
  userConnected: Consultant;
  isUserLoggedInFct: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  esnCurrent: Esn;
  idEsnCurrent: number;
  IsAddEsnAndResp: boolean = false;
  esnSaved: Esn;
  respEsnSaved: Consultant;
  passRespEsnSaved: string;

  constructor(private router: Router
    , private craService: CraService
    , private utils: UtilsService
    , private utilsIhmService: UtilsIhmService
    , private consultantService: ConsultantService
    , private activityService: ActivityService
    , private esnService: EsnService
    , private clientService: ClientService
    , private tokenService: TokenService
    , private http: HttpClient
    , private msgService: MsgService
  ) {
    console.log("data-sharing constructor deb")
    this.notificationUrl = environment.apiUrl + "/notifications";
    this.getCurrentUserFromLocaleStorage()

    console.log("constructor, userConnected", this.userConnected)

    if (this.userConnected == null) {
      this.gotoLogin();
    }

  }

  navigateTo(url) {
    this.router.navigate([url]);
  }

  gotoLogin() {
    console.log("navigate to login ")
    this.router.navigate(['/login']);
  }

  gotoMyProfile() {
    console.log("navigate to myProfile ")
    this.router.navigate(['/my-profile'])
  }

  getCurrentUserFromLocaleStorage(): Consultant {
    let value = localStorage.getItem(UtilsService.TOKEN_STORAGE_USER_CONNECTED);
    if (value != null && value != undefined) {
      if (value == 'true') {
        this.isUserLoggedInFct.next(true);
      } else {
        this.isUserLoggedInFct.next(false);
      }
    } else {
      this.isUserLoggedInFct.next(false);
    }
    let userStr = localStorage.getItem(UtilsService.TOKEN_STORAGE_USER);
    // console.log("getCurrentUserFromLocaleStorage, userStr", userStr)
    if (userStr) {
      // DataSharingService.currentUser.next(JSON.parse(userStr));
      this.setUserConnected(JSON.parse(userStr))
    }

    // this.currentUser = DataSharingService.currentUser;

    return this.userConnected
  }

  // addInfosObservers(cli: MereComponent) {
  //   this.listInfosObservers.push(cli);
  // }

  // updateInfosObservers() {
  //   //////console.log("DS updateInfosObservers")
  //   for (let cli of this.listInfosObservers) {
  //     console.log("DS updateInfosObservers cli", cli)
  //     if (cli) {
  //       cli.updateInfosObserver();
  //     }
  //   }
  // }

  addInfo(info: string) {
    // this.listInfos.push(info);
    // this.updateInfosObservers();
    const current = this.infosSource.value;
    this.infosSource.next([...current, info]);
  }

  // delInfo(info: string) {
  //   let index: number = this.listInfos.indexOf(info);
  //   if (index >= 0) {
  //     this.listInfos.splice(index, 1);
  //     this.updateInfosObservers();
  //   }
  // }

  delInfo(info: string) {
    const current = this.infosSource.value;
    const index = current.indexOf(info);

    if (index >= 0) {
      const updated = [...current]; // copie
      updated.splice(index, 1);
      this.infosSource.next(updated);
    }
  }


  addErrorTxt(errorTxt: string) {
    this.addError(new MyError("", errorTxt))
  }

  addError(error: MyError) {
    //////console.log("DS addError error", error )
    if (!error || !error.msg) return
    //////console.log("DS addError msg", error.msg ) 
    if (error.title) {
      let title = error.title.toUpperCase();
      if (title == "ERREUR 401" || title == "ERROR 401") {
        error.msg += "\n" + ". Il est recomand\u00e9 de se reconnecter.";
      }
    }
    // this.listErrors.push(error)
    // this.updateInfosObservers();
    const current = this.errorsSource.value;
    this.errorsSource.next([...current, error]);
  }

  // delError(error: MyError) {
  //   if (!error || !error.msg) return
  //   let index: number = -1;
  //   let i = -1;
  //   for (let err of this.listErrors) {
  //     i++;
  //     if (err.title == error.title && err.msg == error.msg) {
  //       index = i;
  //       break;
  //     }
  //   }
  //   if (index >= 0) {
  //     this.listErrors.splice(index, 1);
  //     this.updateInfosObservers();
  //   }
  // }

  delError(error: MyError) {
    const current = this.errorsSource.value;
    const index = current.findIndex(e => (e.msg === error.msg && e.title === e.title));

    if (index >= 0) {
      const updated = [...current];
      updated.splice(index, 1);
      this.errorsSource.next(updated);
    }
  }


  // clearInfos() {
  //   this.listInfos = [];
  //   this.updateInfosObservers();
  // }
  /** Efface toutes les infos */
  clearInfos() {
    this.infosSource.next([]);
  }

  // clearErrors() {
  //   this.listErrors = [];
  //   this.updateInfosObservers();
  // }

  /** Efface toutes les erreurs */
  clearErrors() {
    this.errorsSource.next([]);
  }

  clearInfosErrors() {
    this.clearInfos()
    this.clearErrors();
  }

  /***
   * this method used when you need to share current cra in other component
   * @param craContext
   */
  onCraInit(craContext: CraContext): void {
    this.craContext.next(craContext);
  }

  /***
   *This method used to get the current cra context
   */
  getCurrentCraContext(): Observable<CraContext> {
    return of<CraContext>(this.craContext.getValue());
  }

  /***
   * This method used to destroy the current cra context
   */
  onCraDestroy(): void {
    this.craContext.next(null)
  }

  showCra(cra: Cra) {
    console.log("showCra deb", cra)
    if (!cra) {
      console.log("showCra cra NULL !", cra)
      return
    }

    this.currentCra = cra;
    this.isAdd = "";
    this.typeCra = cra.type;

    this.router.navigate(["/cra_form"])
    console.log("showCra fin", cra)
  }

  showFee(fee: NoteFrais) {
    this.currentFee = fee;
    this.isAdd = "";
    this.router.navigate(["/notefrais_form"])
  }

  /**
   * 
   * @param cra 
   * @param tms : 500 
   * @param isReturnIfSameCra : false
   * @returns 
   */
  showCraViaLoading(cra: Cra, tms = 500, isReturnIfSameCra = false) {

    if (isReturnIfSameCra) {
      let lastCra: Cra = this.currentCra;
      if (lastCra && lastCra.id == cra.id) {
        return;
      }
    }

    //pour bien rafraichir la page.
    this.showLoading();

    setTimeout(() => {
      this.showCra(cra);
    }, tms);
  }

  /**
 * 
 * @param fee 
 * @param tms : 500 
 * @param isReturnIfSameCra : false
 * @returns 
 */
  showFeeViaLoading(fee: NoteFrais, tms = 500, isReturnIfSameFee = false) {

    if (isReturnIfSameFee) {
      let lastFee: NoteFrais = this.currentFee;
      if (lastFee && lastFee.id == fee.id) {
        return;
      }
    }

    //pour bien rafraichir la page.
    this.showLoading();

    setTimeout(() => {
      this.showFee(fee);
    }, tms);
  }


  /***
   * This method used to add service in the registry
   * @param service
   */
  addService<T>(service: T): void {
    this.serviceRegistry.set(service.constructor.name, service);
  }

  /***
   * Invoked to get service form the registry
   * @param service
   */
  getService<T>(service: string): T {
    return this.serviceRegistry.get(service);
  }

  public setHeaderComponent(h: HeaderComponent) {
    this.headerComponent = h;
  }
  public notifyHeaderComponent() {
    if (this.headerComponent) this.headerComponent.getNotifications();
  }

  showNotificationsAll() {
    this.clearInfos();
    this.router.navigate(['/notification']);
  }

  showLoading() {
    this.clearInfos();
    this.router.navigate(['/loading']);
  }

  public adminConsultant = {}
  public majAdminConsultantFct(consultant: Consultant, manager: Consultant): void {
    this.majAdminConsultantId(consultant, manager)
  }

  public majAdminConsultantId(consultant: Consultant, manager: Consultant): void {
    if (consultant == null) {
      return
    }

    this.adminConsultant[consultant.id] = manager;
    consultant.adminConsultant = manager;
    consultant.adminConsultantId = manager?.id;

    if (consultant.role == "RESPONSIBLE_ESN") {
      consultant.adminConsultant = null;
      consultant.adminConsultantId = null;
    }
  }

  isCurrenUserRespOrAdmin() {
    let currentUser = this.userConnected
    return currentUser.role == "RESPONSIBLE_ESN" || currentUser.role == "ADMIN"
  }

  getLastUserName() {
    return this.getValueOfKey(UtilsService.TOKEN_STORAGE_KEY_LAST_USERNAME);
  }

  /**
   * 
   * @param credentials 
   * @param caller : objet appelant 
   */
  login(credentials: Credentials, caller: any = null): void {
    this.tokenService.getResponseHeaders(credentials)
      .subscribe(res => {
        console.log("++++++++++++++++login:", credentials, res);
        if (caller) {
          caller.info = "Info : res=" + JSON.stringify(res)
        }

        if (res.status == 200) {
          this.authorization = res.headers.get('authorization');
          // //////////console.log("login: authorization: ", this.authorization);
          this.saveToken(this.authorization);
          this.isUserLoggedInFct.next(true);

          this.setKey(UtilsService.TOKEN_STORAGE_KEY_LAST_USERNAME, credentials.username)

          this.getConsultantConnectedAndHisInfos(credentials.username, caller);


        } else {
          if (caller) {
            caller.error = "ERROR : res=" + JSON.stringify(res)
          }
        }
      }, error => {
        if (caller) {
          caller.error = "ERROR : error=" + JSON.stringify(error)
          //////console.log("error:", credentials, error);
        }
      }
      );
  }

  public logout(): void {
    localStorage.removeItem(UtilsService.TOKEN_STORAGE_KEY);
    localStorage.removeItem(UtilsService.TOKEN_STORAGE_USER);
    localStorage.removeItem(UtilsService.TOKEN_STORAGE_USER_CONNECTED);
    localStorage.removeItem(UtilsService.DEFAULT_LOCALE);
    this.isUserLoggedInFct.next(false);
    this.setUserConnected(null)
    this.router.navigate(["login"]);
  }

  findConsultantByUsername(username: string, fctOk: Function, fctKo: Function) {
    let user: Consultant = null;
    console.log("data-sharing : findConsultantByUsername username:", username)
    this.consultantService.findConsultantByUsername(username).subscribe(
      data => {
        if (data && data.body) {
          user = data.body.result;
          if (fctOk) fctOk(data, user);
        }
      }, error => {
        if (fctKo) fctKo(error);
      }
    );
  }

  majEsnOnConsultant(fctSuccess: Function = null, fctErr: Function) {
    this.esnService.majEsnOnConsultant(this.userConnected, fctSuccess, fctErr)
  }

  /**
   * 
   * @param username 
   * @param caller : object appelant 
   */
  getConsultantConnectedAndHisInfos(username: string, caller: any) {

    this.setUserConnected(null)
    this.consultantService.getConsultantAndHisInfos(username).subscribe(
      data => {
        if (data) {
          this.setUserConnected(data.body.result)
          console.log("findConsultantByUsername userConnected : ", this.userConnected)
          this.esnCurrent = this.userConnected?.esn
          this.idEsnCurrent = this.esnCurrent?.id

          this.majEsnOnConsultant(() => { }, (error) => {
            this.addErrorTxt(JSON.stringify(error))
          })
          console.log("findConsultantByUsername userConnected.esn : ", this.userConnected.esn)
          if (caller) {
            caller.info = "Info : res=" + JSON.stringify(this.userConnected.fullName)
          }
          this.saveTokenUser(this.userConnected);

          if (!this.utils.isEmpty(this.userConnected.adminConsultantUsernameFct)) {

            this.findConsultantByUsername(this.userConnected.adminConsultantUsernameFct,
              (data, user) => {
                console.log("findConsultantByUsername data : ", data)
                console.log("findConsultantByUsername user : ", user)
                this.majAdminConsultantFct(this.userConnected, user);
                this.userConnected.adminConsultant = user
                console.log("findConsultantByUsername userConnected.adminConsultant : ", this.userConnected.adminConsultant)
                this.saveTokenUser(this.userConnected);
              },
              (error) => {
                console.log("findConsultantByUsername: error ", error);
                if (caller) {
                  caller.error = "ERROR : error=" + JSON.stringify(error)
                }
              }
            );
          }

          this.getNotifications();


          this.router.navigate(['/home']);
        }
      }, error => {
        console.log("findConsultantByUsername: error ", error);
        if (caller) {
          caller.error = "ERROR : error=" + JSON.stringify(error)
        }
      }
    );
  }

  //   /**
  //  * 
  //  * @param username 
  //  * @param caller : object appelant 
  //  */
  // findConsultantConnectedByUsername(username: string, caller: any) {
  //   this.setUserConnected(null)
  //   this.consultantService.findConsultantByUsername(username).subscribe(
  //     data => {
  //       if (data) {
  //         this.setUserConnected(data.body.result)
  //         console.log("findConsultantByUsername userConnected : ", this.userConnected)
  //         this.esnCurrent = this.userConnected?.esn 
  //         this.idEsnCurrent = this.esnCurrent?.id 

  //         this.majEsnOnConsultant()
  //         console.log("findConsultantByUsername userConnected.esn : ", this.userConnected.esn)
  //         if (caller) {
  //           caller.info = "Info : res=" + JSON.stringify(this.userConnected.fullName)
  //         }
  //         this.saveTokenUser(this.userConnected);

  //         if (!this.utils.isEmpty(this.userConnected.adminConsultantUsernameFct)) {

  //           this.findConsultantByUsername(this.userConnected.adminConsultantUsernameFct,
  //             (data, user) => {
  //               console.log("findConsultantByUsername data : ", data)
  //               console.log("findConsultantByUsername user : ", user)
  //               this.majAdminConsultantFct(this.userConnected, user);
  //               this.userConnected.adminConsultant = user
  //               console.log("findConsultantByUsername userConnected.adminConsultant : ", this.userConnected.adminConsultant)
  //               this.saveTokenUser(this.userConnected);
  //             },
  //             (error) => {
  //               console.log("findConsultantByUsername: error ", error);
  //               if (caller) {
  //                 caller.error = "ERROR : error=" + JSON.stringify(error)
  //               }
  //             }
  //           );
  //         }


  //         this.router.navigate(['/home']);
  //       }
  //     }, error => {
  //       console.log("findConsultantByUsername: error ", error);
  //       if (caller) {
  //         caller.error = "ERROR : error=" + JSON.stringify(error)
  //       }
  //     }
  //   );
  // }

  private setKey(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getValueOfKey(key: string): string {
    let value: string = localStorage.getItem(key);
    return value;
  }

  private saveToken(token: string) {
    ////////////console.log("saveToken: token=", token);
    localStorage.setItem(UtilsService.TOKEN_STORAGE_KEY, token);
  }

  public getToken(): string {
    let token: string = localStorage.getItem(UtilsService.TOKEN_STORAGE_KEY);
    ////////////console.log("getToken:", token);
    return token;
  }

  saveTokenUser(user: Consultant) {
    localStorage.setItem(UtilsService.TOKEN_STORAGE_USER, JSON.stringify(user));
    localStorage.setItem(UtilsService.TOKEN_STORAGE_USER_CONNECTED, "true");
    //////////console.log("saveTokenUser:", JSON.stringify(user));
  }

  public isLoggedIn(): boolean {
    // console.log("isLoggin this.getToken() = ", this.getToken())
    return this.getToken() != null;
  }

  setUserConnected(user: Consultant) {
    this.userConnected = user
  }

  majManagerOfUserCurent() {
    this.consultantService.majAdminConsultant(this.userConnected)
  }

  mapAct = new Map<number, Activity>();
  majListCra() {
    this.majListCraParam(this.listCra)
  }

  majListCraParam(list: Cra[]) {
    if (list != null) {
      for (let cra of list) {
        this.majCra(cra)
      }
    }
  }

  majCra(cra: Cra) {

    this.majConsultantInCra(cra);
    this.majActivityInCra(cra);
  }

  public majActivityInCra(cra: Cra) {
    if (cra != null) {
      for (let craDay of cra.craDays) {
        if (craDay != null) {
          for (let craDayActivities of craDay.craDayActivities) {
            // craDayActivities.craDay = craDay
            this.majActivityInCraDayActivity(craDayActivities);
          }
        }
      }
    }
  }

  majConsultantInCra(cra: Cra, fct: Function = null) {

    // console.log("majConsultantInCra cra : ", cra);
    if (cra == null) {
      return;
    }

    let consultant = cra.consultant;
    let consultantId = cra.consultantId;
    if (consultantId != null && consultant == null) {
      let consul = this.consultantService.mapConsul[consultantId];
      if (consul != null) {
        cra.consultant = consul;
        this.consultantService.majAdminConsultant(cra.consultant)
        if (fct) fct()
      } else {
        this.consultantService.findById(consultantId).subscribe(
          data => {
            consul = data.body.result;
            this.consultantService.mapConsul[consultantId] = consul;
            cra.consultant = consul;
            console.log("majCra act : ", consul);
            console.log("majCra listCra : ", this.listCra);
            this.consultantService.majAdminConsultant(cra.consultant)
            if (fct) fct()
          }, error => {
            console.log("majCra ERROR : ", error);
          }
        );
      }
    } else {
      this.consultantService.majAdminConsultant(cra.consultant)
    }
  }

  majActivityInCraDayActivity(craDayActivities: CraDayActivity) {

    // console.log("majActivityInCraDayActivity craDayActivities : ", craDayActivities);
    if (craDayActivities == null) {
      return;
    }

    let activity = craDayActivities.activity;
    let activityId = craDayActivities.activityId;
    if (activityId != null && activity == null) {
      let act = this.mapAct[activityId];
      if (act != null) {
        craDayActivities.activity = act;
      } else {
        this.activityService.findById(activityId).subscribe(
          data => {
            act = data.body.result;
            this.mapAct[activityId] = act;
            craDayActivities.activity = act;
            // console.log("majListCra act : ", act);
            // console.log("majListCra listCra : ", this.listCra);
          }, error => {
            console.log("majListCra ERROR : ", error);
          }
        );
      }
    }
  }

  /////////////// dash board 


  notificationUrl: string;
  listNotifications: Notification[];
  listObserversNotifications: MereComponent[] = []
  notifInfo = "";
  notifErrors: MyError[] = []



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

  nbCallNotifications = 0
  isCallNotifications = false

  public getNotifications() {
    let label = "loading Notifications ...";

    if (!this.isCallNotifications) {
      this.isCallNotifications = true
    } else {
      console.log(label, "En cours ...")
      return
    }
    this.nbCallNotifications++
    console.log(label, this.nbCallNotifications)
    this.notifyObserversNotificationsBefore(label)
    this.getNotificationsFromServer().subscribe((data) => {
      // console.log("getNotifications: this, data", this, data)
      this.listNotifications = data.body.result;
      this.majListNotifications();
      console.log("getNotifications ", this.listNotifications)
      this.notifyObserversNotificationsAfter(label, data)
      this.isCallNotifications = false
    }, error => {
      // console.log("getNotifications: this, error", this, error)
      this.notifyObserversNotificationsError(label, error);
      this.isCallNotifications = false
    })
  }

  majListNotifications() {
    for (let notif of this.listNotifications) {
      let cra = notif.cra
      if (cra != null) {
        this.majCra(cra);
      } else {
        let craId = notif.craId
        if (craId != null) {
          notif.cra = this.getCraInListCraById(craId);
          if (notif.cra != null) {
            this.majCra(notif.cra);
          } else {
            this.craService.findById(craId).subscribe(
              data => {
                notif.cra = data.body.result
                this.majCra(notif.cra);
              }, error => {
                this.notifyObserversNotificationsError("majListNotifications majCra craId=" + craId, error);
              }
            )
          }
        }
      }
    }
  }

  getCraInListCraById(craId: number) {
    // console.log("getCraInListCraById : craId, this.listCra = ", craId, this.listCra)
    if (this.listCra) {
      for (let cra of this.listCra) {
        if (cra.id == craId) {
          return cra
        }
      }
    }

    return null
  }

  public addObserverNotifications(cli: MereComponent) {
    this.listObserversNotifications.push(cli);
  }

  public notifyObserversNotificationsBefore(label) {
    for (let cli of this.listObserversNotifications) {
      if (cli) {
        cli.clearInfos()
        cli.beforeCallServer(label)
      }
    }
  }

  public notifyObserversNotificationsAfter(label, data) {
    // //console.log(label, this.listObserversNotifications)
    for (let cli of this.listObserversNotifications) {
      if (cli) {
        console.log("notifyObserversNotificationsAfter cli : ", cli)
        cli.afterCallServer(label, data)
        cli["updateNotifications"](this.listNotifications);
      }
    }
  }

  public notifyObserversNotificationsError(label, error: MyError) {
    for (let cli of this.listObserversNotifications) {
      if (cli) {
        cli.addErrorFromErrorOfServer(label, error);
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

  ///////////////////

  public majClientInProject(p: Project, fct: Function = null) {
    let cond = p && !p.client && p.clientId
    console.log("majClientInProject : cond, p, p.client, p.clientId", cond, p, !p.client, p.clientId)
    if (p && !p.client && p.clientId) {
      this.clientService.findById(p.clientId).subscribe(
        data => {
          p.client = data.body.result;
          console.log("maj client in project p.client : ", p.client)
          if (fct) fct()
        }, error => {
          console.log("majCra ERROR : ", error);
        }
      );
    }
  }

  public majClientInProjectList(list: Project[]) {
    console.log("majClientInProjectList list : ", list)
    if (list) {
      for (let p of list) {
        this.majClientInProject(p);
      }
    }
  }

  ////////////////

  setAdminConsultant(user: Consultant) {
    this.consultantService.majAdminConsultant(user);
  }

  ////////////////////

  sendMailToConfirmInscription(fctOk: Function, fctKo: Function) {
    // send email . si ok, msgBox : un mail a été envoyé. retour à la racine 
    let respEsnSavedName = this.respEsnSaved.fullName
    let esnSavedName = this.esnSaved.name

    let mail = new Mail()
    mail.subject = "ESN360 : Confirmation de l'ajout de votre esn : " + esnSavedName
    mail.to = this.respEsnSaved.email


    let to = mail.to

    mail.msg = `
              Bonjour ${respEsnSavedName},\n<BR>
              \n<BR>
              Votre ESN "${esnSavedName}" et son Responsable "${respEsnSavedName}" ont bien été ajoutés à notre plateforme Esn360.\n<BR>
              \n<BR>
              Email : ${to}\n<BR>
              Password : ${this.passRespEsnSaved}\n<BR>
              url = : ${URL_FRONT}\n<BR>
              \n<BR>
              Cordialement,\n<BR>
              l'équipe ESN 360 \n<BR>
              \n<BR>
              `;

    let label2 = "sendMailSimple"
    console.log("goto " + label2)
    this.msgService.sendMailSimple(mail, this.IsAddEsnAndResp).subscribe(
      data => {
        console.log(label2 + " data : ", data)
        if (fctOk) fctOk(data, to)
      },
      error => {
        if (fctKo) fctKo(error)
      }
    );

  }

  /**
 * Envoie un mail contenant un lien de validation d'adresse email.
 * Le lien a la forme : URL_FRONT + "/validEmail/<code_email_to_validate>"
 * @param fctOk Fonction à exécuter en cas de succès
 * @param fctKo Fonction à exécuter en cas d'erreur
 */
  sendMailToValidEmailInscription(fctOk: Function, fctKo: Function) {
    const respEsnSavedName = this.respEsnSaved.fullName;
    const respEsnMail = this.respEsnSaved.email;
    const esnSavedName = this.esnSaved.name;

    // 🔹 Génération d’un code unique de validation (par ex. UUID ou hash)
    const codeEmailToValidate = this.utils.generateRandomCode(32); // méthode à implémenter côté utilitaire
    const validationUrl = `${URL_FRONT}/validEmail/${codeEmailToValidate}`;

    // 🔹 Construction du mail
    const mail = new Mail();
    mail.subject = `ESN360 : Validation de votre email ${respEsnMail}`;
    mail.to = respEsnMail;
    mail.msg = `
    Bonjour ${respEsnSavedName},<br><br>
    Votre ESN <strong>${esnSavedName}</strong> et son Responsable <strong>${respEsnSavedName}</strong> ont bien été ajoutés à notre plateforme <strong>ESN360</strong>.<br><br>
    Avant de pouvoir vous connecter, veuillez valider votre adresse email en cliquant sur le lien suivant :<br><br>
    👉 <a href="${validationUrl}" target="_blank">${validationUrl}</a><br><br>
    <hr>
    Vos identifiants :<br>
    Email : ${respEsnMail}<br>
    Mot de passe : ${this.passRespEsnSaved}<br><br>
    Cordialement,<br>
    L’équipe <strong>ESN360</strong><br>
  `;

    // 🔹 Envoi du mail
    const label = "sendMailToValidEmailInscription";
    console.log("goto " + label);

    this.msgService.sendMailSimple(mail, this.IsAddEsnAndResp).subscribe(
      (data) => {
        console.log(label + " data : ", data);
        if (fctOk) fctOk(data, respEsnMail, codeEmailToValidate);
      },
      (error) => {
        console.error(label + " error : ", error);
        if (fctKo) fctKo(error);
      }
    );
  }


}
