import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {DataSharingService} from "../../service/data-sharing.service";
import {MyError} from 'src/app/resource/MyError';
import { Consultant } from 'src/app/model/consultant';
import { UtilsService } from 'src/app/service/utils.service';
import { Esn } from 'src/app/model/esn';
import { Search } from 'angular2-multiselect-dropdown/lib/menu-item';

@Component({
  selector: 'infors',
  templateUrl: './mere-infos.component.html',
  styleUrls: ['./mere.component.css']
})
export class MereComponent implements OnInit {

  searchStr: string = "";
	protected myList00 = null;

  listInfos : Array<string> = [];
	listErrors: MyError[];

  //pagination
  currentPage : number = 1;  
  itemsPerPage : number = 5;

  isShowLoading = false

  loadingComponenet: boolean = true;

  // info: string = '' ;
  
  public isLoading : boolean = false;
  nbCallServer = 0;
  @ViewChild('infors', {static: false}) infors: MereComponent;

  @ViewChild('clearInfosBtn', {static: false}) clearInfosBtn: ElementRef;

	userConnected: Consultant = DataSharingService.userConnected;

  constructor(public utils: UtilsService, protected dataSharingService: DataSharingService) { 
    if(!this.listErrors) this.listErrors = []
   }

  ngOnInit() {
    this.userConnected = this.dataSharingService.getCurrentUserFromLocaleStorage();
  }

  getEsnCurrent() {
    let esn:Esn = null;
    if(this.userConnected) {
      esn = this.userConnected.esn;
    }
    return esn;
  }  

  getEsnCurrentName() {
    let esn:Esn = this.getEsnCurrent();
    if(esn) return esn.name;
    else return "";
  }

  getCurentUserName() {
    let s = "";
    let user = this.userConnected? this.userConnected.fullName : "";
    if(user) {
      s = user
    }
    return s;
  }

  getCurentUserEmail() {
    let s = "";
    let userEmail = this.userConnected? this.userConnected.email : "";
    if(userEmail) {
      s = userEmail
    }
    return s;
  }

  getManagerOfUserCurent() {
    let s = "";
    let user = this.userConnected? this.userConnected.fullName : "";
    if(user) {
      let managerName = this.userConnected.adminConsultant ? this.userConnected.adminConsultant?.fullName : "";
      if(managerName) {
        s = managerName;
      }
    }
    return s;
  }

  getManagerEmailOfUserCurent() {
    let s = "";
    let user = this.userConnected? this.userConnected.fullName : "";
    if(user) {
      let managerEmail = this.userConnected.adminConsultant ? this.userConnected.adminConsultant?.email : "";
      if(managerEmail) {
        s = managerEmail;
      } 
    }
    return s;
  }

  getEsnId() {
    let esn:Esn = this.getEsnCurrent();
    if(esn) return esn.id;
    else return -1;
  }

  updateInfosObserver() {
    //////console.log("MERE updateInfosObservers this", this)
    //////console.log("MERE updateInfosObservers listInfos", this.listInfos)
    //////console.log("MERE updateInfosObservers listErrors", this.listErrors)
    this.listInfos = this.dataSharingService.listInfos;
    this.listErrors = this.dataSharingService.listErrors;
    this.setInfosMere();
    this.userConnected = this.dataSharingService.getCurrentUserFromLocaleStorage();
  }

  clearInfos() {
    //////////console.log("DBG MereComponent clearInfos")
    this.dataSharingService.clearInfosErrors()
    this.nbCallServer = 0
    
  }

  setInfosMere() {
    //////console.log("MERE setInfosMere infors", this.infors)
    if(this.infors) {
      this.infors.listInfos = this.listInfos ;
      this.infors.listErrors = this.listErrors ;
      //////console.log("MERE setInfosMere infors.listInfos", this.infors.listInfos)
      //////console.log("MERE setInfosMere infors.listErrors", this.infors.listErrors)
    }
    else {
      //////console.log("!!!!!!!!!!!!!!!!!!!!!!! setInfosMere infors NOT EXIST !!!!!!!!!!!!!!!!!!!!!!!!", this)
    }
  }

  addInfo(info:string, isShowLoading = true) {
    //////////console.log("///////// DATA SHARING add info " , info, this)
    this.isShowLoading = isShowLoading;
    this.dataSharingService.addInfo(info)
  }

  delInfo(info:string) {
    this.dataSharingService.delInfo(info)
  }

  getlistInfos() {
    // if(this.infors) this.listInfos = this.infors.listInfos
    // if(this.infors) {
    //   this.listInfos = this.infors.listInfos ;
    // }
    // else {
    //   //////console.log("!!!!!!!!!!!!!!!!!!!!!!! getlistInfos infors NOT EXIST !!!!!!!!!!!!!!!!!!!!!!!!", this)
    // }
    this.listInfos = this.dataSharingService.listInfos;
    return this.listInfos;
  }

  isInfoOrError() {
    return this.isInfo() || this.isError();
  }

  isInfo() {
    this.listInfos = this.dataSharingService.listInfos;
    return this.listInfos && this.listInfos.length>0;
  }

  isError() {
    this.listErrors = this.dataSharingService.listErrors;
    //////console.log("IsError listErrors:", this.listErrors)
    return this.listErrors && this.listErrors.length>0 ;
  }

  getError() {
    // if(this.infors) this.error = this.infors.getError()
    return this.listErrors;
  }

  // getErrorStr() {
  //   let err = this.getError()
  //   return err? this.getErrorTitleMsg(err) : "" ;
  // }

  addError(error:MyError) {
    // console.log("addError error:", error)
    if(!error || !error.msg ) return 
    //////console.log("addError add msg:", error.msg)
    this.dataSharingService.addError(error)
  }

  getErrorTitleMsg(err : MyError) {
    // ////////console.log("getErrorTitleMsg err:", err)
    let s = '';
    if(err) {
      let title = err.title;
      if(title) s = title;
      let msg = err.msg;
      if(msg) {
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
    this.addError( error );
    //////////console.log("addErrorFromResultOfServer id="+id+" data:", data, error)
    this.utils.showNotifSuccessOrError(error);
  }

  addErrorFromErrorOfServer(id: string, error: MyError) {
    ////////console.log("addErrorFromErrorOfServer id="+id + " error:", error)
    // this.setError( this.getErrorStr() + " ; " + this.utils.getErrorFromErrorOfServer(error) );
    error = this.utils.getErrorFromErrorOfServer(error)
    this.addError( error );
    this.utils.showNotification("error", this.getErrorTitleMsg(error));
    this.endLoading(id)
  }

  beforeCallServer(id: string) {
    let info = id 
    //////////console.log("beforeCallServer id="+id + " info="+info)
    this.nbCallServer++;
    this.isLoading = true;
    if( this.nbCallServer==1) this.addError(null);
    this.addInfo(info)
	}
  afterCallServer(id:string, data: any) {
    ////console.log("afterCallServer id="+id+" this, data, data.body :", this, data)
    this.addErrorFromResultOfServer(id, data);
    this.endLoading(id)
  }
  endLoading(id:string) {
    this.nbCallServer--;
    this.delInfo( id );
    this.isLoading = false;

  }

  setMyList(list : any[]) : void {}

  search() {
		// this.searchStr = this.searchStr.trim();
		// console.log("this.searchStr="+this.searchStr)
		if(!this.searchStr) { this.setMyList( this.myList00); }
		else {this.setMyList( this.utils.search(this.myList00, this.searchStr) );}
	}

  clearSearch() {
    this.searchStr = "";
    this.search();
  }

}
