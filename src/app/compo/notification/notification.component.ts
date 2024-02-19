import {AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DashboardService} from "../../service/dashboard.service";
import {UtilsService} from "../../service/utils.service";
import {Notification} from "../../model/notification";
import { MereComponent } from '../_utils/mere-component';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoteFrais } from 'src/app/model/noteFrais';
import { Document } from 'src/app/model/document';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent extends MereComponent implements AfterViewInit {

  @Input() isOnlyNotViewed : boolean = false;
  @Input() isShowBtns : boolean = true;
  @Input() idPagination = "idPagination";
  myList: Notification[];
  nbNotification = 0;
  title = "";

  refreshEverySecMin = 5;
  refreshEverySec = 10;  //seconds
  refreshLoopId : any;
  refreshStarted = false;

  dirImg = "assets/images/"
  imgRead = this.dirImg + "mail_read.png";
  imgUnRead = this.dirImg + "mail_unread.png";
  imgNotification = "";
  notifBulle = "";

  @ViewChild('detailsFeeView', { static: true }) detailsFeeView: TemplateRef<any>;
  selectedFee: NoteFrais;
  
  @ViewChild('detailsDocumentView', { static: true }) detailsDocumentView: TemplateRef<any>;
  selectedDocument: Document;

  
  constructor(
    public utils: UtilsService
    , protected dataSharingService: DataSharingService
    , protected utilsIhm: UtilsIhmService
    , private dashboardService: DashboardService
    , private dialog: MatDialog
    , private modal: NgbModal
    ) {
      super(utils, dataSharingService);
      dashboardService.addObserverNotifications(this)
       
  }

  ngOnInit() {
    // if(!this.myList) this.updateNotifications(this.dashboardService.getListNotifications()); 
    this.getNotifications();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  getNbElement() {
    this.nbNotification = this.myList ? this.myList.length : 0;
    return this.nbNotification;
  }  

  setTitle() {
    var t= "List Notifications"
    if(this.isOnlyNotViewed) t+= " Not Viewed"

    this.title = t + " (" + this.getNbElement() + ")";
  }

  refresh() {
    if(this.refreshEverySec < this.refreshEverySecMin) this.refreshEverySec = this.refreshEverySecMin;
    if(!this.refreshStarted) {
      this.refreshLoopId = setInterval( () => {this.getNotifications();}  , 1000 * this.refreshEverySec);
      this.refreshStarted = true;
    }else {
      if(this.refreshLoopId) clearInterval(this.refreshLoopId);
      this.refreshStarted = false;
    }
  }

  isMyListEmpty() {
    return this.getNbElement() == 0;
  }

  /**
   * 
   * @param listAll called by dashboardService, after calling it
   */
  updateNotifications(listAll : Notification[]) {

    // ////////console.log("isOnlyNotViewed="+this.isOnlyNotViewed)
    if(this.isOnlyNotViewed) {
      this.myList = []
      if(listAll) {
        for(let n of listAll) {
          if(! n.viewed) {
            this.myList.push(n)
          }
        }
      }
    }else {
      this.myList = listAll;
    }

    this.getNbElement();
    this.setTitle();

    this.myList00 = this.myList;

  } 

  setMyList(myList : any[]) {
		this.myList = myList;
	}

  getNotifications() {

    ////////console.log("isOnlyNotViewed="+this.isOnlyNotViewed)

    this.dashboardService.getNotifications();

  }

  saveNotification(notification: Notification) {
    this.dashboardService.saveNotification(notification);
  }

  changeViewed(notification: Notification) {
    if(notification.viewed == null) notification.viewed = false;
    notification.viewed = !notification.viewed;
    this.saveNotification(notification);
  }
  getBulle(notification: Notification) {
    if(notification.viewed == null) notification.viewed = false;
    if(notification.viewed) this.notifBulle = "Set Unread"
    else this.notifBulle = "Set Read"
    return this.notifBulle
  }
  getImgRead(notification: Notification) {
    if(notification.viewed == null) notification.viewed = false;
    if(notification.viewed) this.imgNotification = this.imgRead
    else this.imgNotification = this.imgUnRead
    return this.imgNotification
  }


  deleteNotification(notification: Notification) {
    let mythis = this;
		this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec date=" + notification.createdDate, mythis
		, ()=> {
        mythis.dashboardService.deleteNotification(notification.id);
		}
		, ()=>{}
		);

  }

  getTitle() {
    return "Note de Frais N° "+ this.selectedFee.id;
  }

  getTimeAgoNotification(notification: Notification) {

    let dateFrom:Date = new Date();

    if(!notification) return -1;
    // notification = this.dashboardService.getNotificationNettoyee(notification);
    
    var date1 : any = notification.createdDate ;
    // var date1 : Date = new Date() ;

    let date2 = dateFrom;

    // let typeDate = typeof date1;
    
    if( typeof date1 == "string" ) {
      // 2021-06-28T15:36:21.977+0000
      date1 = new Date(notification.createdDate); 
    }

    // To calculate the time difference of two dates
    var ms = date2.getTime() - date1.getTime();

    var sTotal = Math.floor(ms/1000);
    var mnTotal = Math.floor(sTotal/60);
    var s = sTotal - mnTotal*60;
    
    var hTotal = Math.floor(mnTotal/60);
    var mn = mnTotal - hTotal*60;
    
    var dTotal = Math.floor(hTotal/24);
    var h = hTotal - dTotal*24;

    return dTotal + " days " + h + " hours " + mn + " mn " ;
  }

  showForm(notification: Notification) {
    this.clearInfos();
    notification.viewed = true;
    this.saveNotification(notification);

    this.dataSharingService.fromNotif = true;
    this.dataSharingService.showCra(notification.currentCra);

  }

  showCra(notification: Notification) {
    console.log("showCra", notification) 

    this.clearInfos();
    notification.viewed = true;
    this.saveNotification(notification);

    this.dataSharingService.fromNotif = true;
    this.dataSharingService.showCraViaLoading(notification.currentCra);
  }

  showFee(notification: Notification) {
    this.selectedFee = notification.currentFee;
    console.log("showFee", notification) 
    this.modal.open(this.detailsFeeView, { size: 'lg' });
    this.clearInfos();
    notification.viewed = true;
    this.saveNotification(notification);

    this.dataSharingService.fromNotif = true;
    // this.dataSharingService.showFeeViaLoading(notification.currentFee);
  }

  showDocument(notification: Notification){
    this.selectedDocument = notification.currentDocument;
    console.log("showDoc", notification) 
    this.modal.open(this.detailsDocumentView, { size: 'lg' });
    this.clearInfos();
    notification.viewed = true;
    this.saveNotification(notification);

    this.dataSharingService.fromNotif = true;
  }

  getLabelShowCraConge(notification: Notification) {
    let s = "";
    let type = notification.title.split(" ")[0];
    type = this.utils.tr(type);
    let show = this.utils.tr("Show");

    // console.log("type="+type+".") 

    s = show + " " + type;
    return s;
  }

}
