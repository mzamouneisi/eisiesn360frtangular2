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
import {CraContext} from "./model/cra-context";
import {Observable} from "rxjs";

export declare interface CraStateService {
  /***
   * This method used to init cra context
   * @param craContext
   */
  onCraInit(craContext: CraContext): void;

  /***
   * This method invoked to get current cra context
   */
  getCurrentCraContext(): Observable<CraContext>;

  /***
   * This method used to destroy cra context
   * @param craContext
   */
  onCraDestroy(): void;
}

/***
 * Declare the interface of pattern cra cra observable
 */
export declare interface CraObservable {
  /***
   * used to subscribe new observer
   * @param observer
   */
  subscribe(observer: CraObserver): void;

  /****
   * used to unsubscribe observe
   * @param observer
   */
  unsubscribe(observer: CraObserver): void;

  /***
   * used to notify all observers
   */
  notifyObservers(): void;

}

/***
 * Declare the interface of pattern cra cra Observer
 */
export declare interface CraObserver {
  /***
   * used to update the state of observer
   * @param observable
   */
  update(observable: CraObservable): void;
}

/***
 * Used to save the service in registry
 */
export declare interface ServiceLocator {
  /***
   * Used add service in the current registry
   * @param service
   */
  addService<T>(service: T ):void;

  /***
   * used to get service form the registry
   */
  getService<T>(service:string):T;

}
