import {Injectable, OnInit} from '@angular/core';

import {BehaviorSubject, Observable, of} from "rxjs";
import {UtilsService} from "./utils.service";
import {Consultant} from "../model/consultant";
import {CraStateService, ServiceLocator} from "../core/core";
import {CraContext} from "../core/model/cra-context";
import { Cra } from '../model/cra';
import { Router } from '@angular/router';
import { HeaderComponent } from '../layout/header/header.component';
import { MyError } from '../resource/MyError';
import { MereComponent } from '../compo/_utils/mere-component';
import { ConsultantService } from './consultant.service';
import { NoteFrais } from '../model/noteFrais';
// import { CraService } from './cra.service';

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

@Injectable({
  providedIn: 'root'
})
export class DataSharingService implements CraStateService, ServiceLocator {

  headerComponent: HeaderComponent;

  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // public static currentUser: BehaviorSubject<Consultant> = new BehaviorSubject<Consultant>(new Consultant());
  craContext: BehaviorSubject<CraContext> = new BehaviorSubject<CraContext>(null);
  public serviceRegistry: Map<string, any> = new Map<string, any>();
  public static userConnected: Consultant;

  listInfos : Array<string> = [];
	listErrors: MyError[] = [];
  listInfosObservers : MereComponent[] = [];
  listCra: Cra[];
  isAdd: string;
  typeCra: string;
  currentCra: Cra;
  currentFee: NoteFrais;
  fromNotif: boolean;

  constructor(private router: Router
    // , private craService: CraService
    , private utils: UtilsService
    , private consultantService: ConsultantService
    ) {
      this.getCurrentUserFromLocaleStorage()

  }
  getCurrentUserFromLocaleStorage() : Consultant {
    let value = localStorage.getItem(UtilsService.TOKEN_STORAGE_USER_CONNECTED);
    if (value != null && value != undefined) {
      if (value == 'true') {
        this.isUserLoggedIn.next(true);
      } else {
        this.isUserLoggedIn.next(false);
      }
    } else {
      this.isUserLoggedIn.next(false);
    }
    let userStr = localStorage.getItem(UtilsService.TOKEN_STORAGE_USER);
    if (userStr) {
      // DataSharingService.currentUser.next(JSON.parse(userStr));
      DataSharingService.userConnected = JSON.parse(userStr)
    }

    // this.currentUser = DataSharingService.currentUser;
    return DataSharingService.userConnected
  }

  addInfosObservers(cli : MereComponent) {
    this.listInfosObservers.push(cli);
  }

  updateInfosObservers() {
    //////console.log("DS updateInfosObservers")
    for(let cli of this.listInfosObservers) {
      //////console.log("DS updateInfosObservers cli", cli)
      if(cli) {
        cli.updateInfosObserver();
      }
    }
  }

  addInfo(info:string) {
    this.listInfos.push(info);
    this.updateInfosObservers();
  }

  delInfo(info:string) {
    let index: number = this.listInfos.indexOf(info);
    if(index>=0) {
      this.listInfos.splice(index, 1);
      this.updateInfosObservers();
    }
  }

  addError(error:MyError) {
    //////console.log("DS addError error", error )
    if(!error || !error.msg ) return 
    //////console.log("DS addError msg", error.msg ) 
    if(error.title) {
      let title = error.title.toUpperCase();
      if(title == "ERREUR 401" || title == "ERROR 401") {
        error.msg += "\n" + ". Il est recomand\u00e9 de se reconnecter.";
      }
    }
    this.listErrors.push(error)
    this.updateInfosObservers();
  }

  delError(error:MyError) {
    if(!error || !error.msg ) return 
    let index: number = -1;
    let i=-1;
    for(let err of this.listErrors) {
      i++;
      if(err.title == error.title && err.msg == error.msg) {
        index = i;
        break;
      }
    }
    if(index>=0) {
      this.listErrors.splice(index, 1);
      this.updateInfosObservers();
    }
  }

  clearInfos() {
    this.listInfos = [];
    this.updateInfosObservers();
  }

  clearErrors() {
    this.listErrors = [];
    this.updateInfosObservers();
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
    ////////console.log("showCra deb", cra)

    this.currentCra = cra;
    this.isAdd = "";
    this.typeCra = cra.type;

    this.router.navigate(["/cra_form"])
    ////////console.log("showCra fin", cra)
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

    if(isReturnIfSameCra) {
      let lastCra:Cra = this.currentCra;
      if(lastCra && lastCra.id == cra.id){
        return ;
      }
    }
    
    //pour bien rafraichir la page.
    this.showLoading();

    setTimeout( () => {
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

      if(isReturnIfSameFee) {
        let lastFee:NoteFrais = this.currentFee;
        if(lastFee && lastFee.id == fee.id){
          return ;
        }
      }
      
      //pour bien rafraichir la page.
      this.showLoading();
  
      setTimeout( () => {
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

  isConsultant(): boolean {
	  let res = false;
	  if(DataSharingService.userConnected != null) {
		  if( DataSharingService.userConnected.role == "CONSULTANT") res = true;
	  }
	  return res;
  }

  public setHeaderComponent(h: HeaderComponent) {
    this.headerComponent=h;
  }
  public notifyHeaderComponent() {
    if(this.headerComponent) this.headerComponent.getListNotifications();
  }

  showNotificationsAll() {
    this.clearInfos();
    this.router.navigate(['/notification']);
  }

  showLoading() {
    this.clearInfos();
    this.router.navigate(['/loading']);
  }

  findConsultantByUsername(username: string, fctOk: Function, fctKo: Function) {
	  let user: Consultant = null;
    this.consultantService.findConsultantByUsername(username).subscribe(
      data => {
        if (data && data.body) {
          user = data.body.result;
          fctOk(data, user);
        }
      }, error => {
        fctKo(error);
      }
    );
  }

}

