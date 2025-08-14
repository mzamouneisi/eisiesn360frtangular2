import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Consultant } from 'src/app/model/consultant';
import { Esn } from 'src/app/model/esn';
import { MyError } from 'src/app/resource/MyError';
import { UtilsService } from 'src/app/service/utils.service';
import { DataSharingService } from "../../service/data-sharing.service";

@Component({
  selector: 'infors',
  templateUrl: './mere-infos.component.html',
  styleUrls: ['./mere.component.css']
})
export class MereComponent implements OnInit, AfterViewInit, AfterContentInit {

  searchStr: string = "";
  protected myList00 = null;
  protected colsSearch: string[] = null;

  listInfos: Array<string> = [];
  listErrors: MyError[];

  private subscriptions: Subscription[] = [];

  //pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  isShowLoading = false

  loadingComponenet: boolean = true;

  // info: string = '' ;

  public isLoading: boolean = false;
  nbCallServer = 0;
  @ViewChild('infors', { static: false }) infors: MereComponent;

  @ViewChild('clearInfosBtn', { static: false }) clearInfosBtn: ElementRef;

  @ViewChild('searchStrInput') searchStrInput: ElementRef<HTMLInputElement>;

  public userConnected: Consultant;
  public userConnectedName: String;
  public esnCurrent: Esn;
  public idEsnCurrent: number = -1;
  public esnName = ""
  // esnCurrentName = null;
  public isUserLoggedIn: boolean;
  public isUserAdmin: boolean;

  constructor(public utils: UtilsService, public dataSharingService: DataSharingService
  ) {
    this.userConnected = dataSharingService.userConnected;
    if (!this.listErrors) this.listErrors = []
  }
  ngAfterContentInit(): void {
    //
  }
  ngAfterViewInit(): void {
    //
  }

  navigateTo(url) {
    this.dataSharingService.navigateTo(url);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    console.log("Mere.ngOnInit deb")

    this.subscriptions.push(
      this.dataSharingService.infos$.subscribe(infos => this.listInfos = infos),
      this.dataSharingService.errors$.subscribe(errors => this.listErrors = errors)
    );

    //setAdminConsultant 
    this.dataSharingService.setAdminConsultant(this.userConnected)

    this.dataSharingService.isUserLoggedInFct.subscribe(value => {
      this.isUserLoggedIn = value;
      // console.log("*** isUserLoggedIn = ", this.isUserLoggedIn)
      // console.log("*** esnCurrent = ", this.esnCurrent)
      if (this.isUserLoggedIn) {
        setTimeout(
          () => {
            this.userConnected = this.dataSharingService.userConnected
            // console.log("*** userConnected = ", this.userConnected)

            this.getCurentUserName()

            this.isUserAdmin = this.userConnected?.admin;

            if (!this.esnCurrent) {

              this.dataSharingService.majEsnOnConsultant(
                (esn) => {

                  this.esnCurrent = this.userConnected?.esn
                  // console.log("*** esnCurrent 2 = ", this.esnCurrent)
                  // this.esnCurrent = this.userConnected?.esn 
                  this.dataSharingService.esnCurrent = this.esnCurrent
                  this.dataSharingService.idEsnCurrent = this.esnCurrent?.id
                  this.idEsnCurrent = this.dataSharingService.idEsnCurrent
                  if (this.esnCurrent != null) {
                    this.idEsnCurrent = this.esnCurrent.id;
                    if (this.userConnected) {
                      this.userConnected.esn = this.esnCurrent
                    }
                  }
                  this.esnName = this.userConnected?.esnName;
                  if (!this.esnName) this.esnName = this.userConnected?.esn?.name;
                  if (this.esnName) this.userConnected.esnName = this.esnName
                  // console.log("*** esnName = ", this.esnName)
                }, (error) => {
                  this.addErrorTxt(JSON.stringify(error))
                }
              );
            }

          }, 1000
        )

      } else {
        this.isUserAdmin = false;
      }

      if (this.userConnected == null) {
        this.dataSharingService.gotoLogin();
      }

    });

    // this.userConnected = this.getCurrentUserFromLocaleStorage();

    // setTimeout(
    //   ()=>{

    //     this.dataSharingService.userConnected = this.userConnected 
    //     this.esnCurrent = this.userConnected?.esn 
    //     this.dataSharingService.esnCurrent = this.esnCurrent
    //     this.dataSharingService.idEsnCurrent = this.esnCurrent?.id 
    //     this.idEsnCurrent = this.dataSharingService.idEsnCurrent

    //     console.log("**** setTimeout userConnected : ", this.userConnected)
    //     console.log("**** setTimeout dataSharingService.userConnected : ", this.dataSharingService.userConnected)
    //     if(this.userConnected?.esn == null) this.userConnected = this.dataSharingService.userConnected
    //     this.esnCurrent = this.userConnected?.esn 
    //     console.log("**** setTimeout esnCurrent : ", this.esnCurrent)
    //     if(this.esnCurrent != null) {
    //       this.idEsnCurrent = this.esnCurrent.id;
    //     }
    //     console.log("**** setTimeout idEsnCurrent : ", this.idEsnCurrent)
    //   }, 3000
    // )
  }

  // isLoggedIn() {
  //   return this.dataSharingService.isLoggedIn();
  // }

  logout() {
    this.dataSharingService.logout();
  }

  getUserFullName() {
    let userConnected = this.dataSharingService.userConnected
    let res = "LOGIN";
    if (userConnected != null && userConnected.firstName) {
      res = userConnected.fullName;
    }
    // //////////console.log("**** getUserFullName : res=", res, userConnected);
    return res;
  }

  public changeLanguage(code: string) {
    localStorage.setItem('locale', code);
    this.utils.setLang(code)
    window.location.reload();

  }

  getCurrentUserFromLocaleStorage(): Consultant {
    return this.dataSharingService.getCurrentUserFromLocaleStorage()
  }

  isConsultant(): boolean {
    return this.isConsultantFct(this.dataSharingService.userConnected);
  }

  isConsultantFct(c: Consultant): boolean {
    let res = false;
    if (c != null) {
      if (c.role == "CONSULTANT") res = true;
    }
    return res;
  }

  setUserConnected(user: Consultant) {
    this.dataSharingService.setUserConnected(user)
  }

  getEsnCurrent() {
    return this.userConnected?.esn;
  }

  setEsnCurrent(esn: Esn) {
    this.userConnected.esn = esn
    this.setUserConnected(this.userConnected)
  }

  getEsnCurrentName() {
    let esn: Esn = this.getEsnCurrent();
    return esn != null ? esn.name : "";
  }

  getCurentUserName() {
    let s = "";
    let user = this.userConnected ? this.userConnected.fullName : "";
    if (user) {
      s = user
    }
    this.userConnectedName = s
    return s;
  }

  getCurentUserEmail() {
    let s = "";
    let userEmail = this.userConnected ? this.userConnected.email : "";
    if (userEmail) {
      s = userEmail
    }
    return s;
  }

  getManagerEmailOfUserCurent() {
    let s = this.userConnected ? this.userConnected.adminConsultant?.email : "";
    return s;
  }

  getEsnId() {
    return this.userConnected ? this.userConnected.esnId : -1
  }

  isAdmin(): boolean {
    return this.userConnected.admin;
  }

  // updateInfosObserver() {
  //   // console.log("updateInfosObserver deb")
  //   //////console.log("MERE updateInfosObservers this", this)
  //   console.log("MERE updateInfosObservers listInfos", this.listInfos)
  //   console.log("MERE updateInfosObservers listErrors", this.listErrors)
  //   // this.listInfos = this.dataSharingService.listInfos;
  //   // this.listErrors = this.dataSharingService.listErrors;
  //   this.setInfosMere();
  //   this.userConnected = this.getCurrentUserFromLocaleStorage();
  //   this.setUserConnected(this.userConnected)
  // }

  clearInfos() {
    //////////console.log("DBG MereComponent clearInfos")
    this.dataSharingService.clearInfosErrors()
    this.nbCallServer = 0

  }

  setInfosMere() {
    //////console.log("MERE setInfosMere infors", this.infors)
    if (this.infors) {
      this.infors.listInfos = this.listInfos;
      this.infors.listErrors = this.listErrors;
      //////console.log("MERE setInfosMere infors.listInfos", this.infors.listInfos)
      //////console.log("MERE setInfosMere infors.listErrors", this.infors.listErrors)
    }
    else {
      //////console.log("!!!!!!!!!!!!!!!!!!!!!!! setInfosMere infors NOT EXIST !!!!!!!!!!!!!!!!!!!!!!!!", this)
    }
  }

  addInfo(info: string, isShowLoading = true) {
    //////////console.log("///////// DATA SHARING add info " , info, this)
    this.isShowLoading = isShowLoading;
    this.dataSharingService.addInfo(info);
  }

  delInfo(info: string) {
    this.dataSharingService.delInfo(info)
  }

  // getlistInfos() {
  //   // if(this.infors) this.listInfos = this.infors.listInfos
  //   // if(this.infors) {
  //   //   this.listInfos = this.infors.listInfos ;
  //   // }
  //   // else {
  //   //   //////console.log("!!!!!!!!!!!!!!!!!!!!!!! getlistInfos infors NOT EXIST !!!!!!!!!!!!!!!!!!!!!!!!", this)
  //   // }
  //   this.listInfos = this.dataSharingService.listInfos;
  //   return this.listInfos;
  // }

  isInfoOrError() {
    return this.isInfo() || this.isError();
  }

  isInfoAndNotError() {
    return this.isInfo() && !this.listErrors;
  }

  isInfo() {
    // this.listInfos = this.dataSharingService.listInfos;
    return this.listInfos && this.listInfos.length > 0;
  }

  isError() {
    // this.listErrors = this.dataSharingService.listErrors;
    //////console.log("IsError listErrors:", this.listErrors)
    return this.listErrors && this.listErrors.length > 0;
  }

  getError() {
    // if(this.infors) this.error = this.infors.getError()
    return this.listErrors;
  }

  // getErrorStr() {
  //   let err = this.getError()
  //   return err? this.getErrorTitleMsg(err) : "" ;
  // }

  addErrorTxt(errorTxt: string) {
    this.dataSharingService.addErrorTxt(errorTxt)
  }

  addError(error: MyError) {
    // console.log("addError error:", error)
    if (!error || !error.msg) return
    //////console.log("addError add msg:", error.msg)
    this.dataSharingService.addError(error)
  }

  getErrorTitleMsg(err: MyError) {
    // ////////console.log("getErrorTitleMsg err:", err)
    let s = '';
    if (err) {
      let title = err.title;
      if (title) s = title;
      let msg = err.msg;
      if (msg) {
        s = s + " : " + msg;
      }
    }
    // ////////console.log("getErrorTitleMsg s="+ s)
    return s;
  }

  addErrorTitleMsg(title: string, msg: string) {
    this.addError(new MyError(title, msg))
  }

  addErrorFromResultOfServer(id: string, data: any) {
    let error = this.utils.getErrorFromResultOfServer(data)
    //////////console.log(">>>> addErrorFromResultOfServer: error=", error)
    this.addError(error);
    //////////console.log("addErrorFromResultOfServer id="+id+" data:", data, error)
    this.utils.showNotifSuccessOrError(error);
  }

  addErrorFromErrorOfServer(id: string, error: MyError) {
    console.log("addErrorFromErrorOfServer id=" + id + " error:", error)
    // this.setError( this.getErrorStr() + " ; " + this.utils.getErrorFromErrorOfServer(error) );
    error = this.utils.getErrorFromErrorOfServer(error)
    this.addError(error);
    this.utils.showNotification("error", this.getErrorTitleMsg(error));
    this.endLoading(id)
  }

  beforeCallServer(id: string) {
    let info = id
    //////////console.log("beforeCallServer id="+id + " info="+info)
    this.nbCallServer++;
    this.isLoading = true;
    if (this.nbCallServer == 1) this.addError(null);
    this.addInfo(info)
  }
  afterCallServer(id: string, data: any) {
    console.log("afterCallServer id=" + id + " this : ", this)
    console.log("afterCallServer id=" + id + " data :", data)
    this.addErrorFromResultOfServer(id, data);
    this.endLoading(id)
  }
  endLoading(id: string) {
    this.nbCallServer--;
    this.delInfo(id);
    this.isLoading = false;

  }

  setMyList(list: any[]): void { 
    // this.myLi = list 
  }

  search() {
    // this.searchStr = this.searchStr.trim();
    // console.log("this.searchStr="+this.searchStr)
    if (!this.searchStr) { this.setMyList(this.myList00); }
    else { this.setMyList(this.utils.search(this.myList00, this.searchStr, this.colsSearch)); }
  }

  searchStrClick() {
    console.log("disabsearchStrClick searchStrInput : ", this.searchStrInput)
    this.enableInputSearchStr();
  }


  clearSearch() {
    this.searchStr = "";
    this.search();
  }

  disableInputSearchStr() {
    // console.log("disableInputSearchStr DEB searchStrInput : ", this.constructor.name, this.searchStrInput)
    if (this.searchStrInput != null) {
      let inputElement = this.searchStrInput.nativeElement;
      inputElement.disabled = true;
    }
  }

  enableInputSearchStr() {
    // console.log("enableInputSearchStr DEB searchStrInput : ", this.constructor.name, this.searchStrInput)
    if (this.searchStrInput != null) {
      this.dataSharingService.isDisableSearchStrInput = false;
    }
  }

  isListEmpty(list: any[]): boolean {
    return list == null || list.length == 0
  }

  public majAdminConsultantFct(consultant: Consultant, manager: Consultant): void {
    this.dataSharingService.majAdminConsultantFct(consultant, manager);

  }

}
