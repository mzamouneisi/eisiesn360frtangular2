import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MereComponent } from 'src/app/compo/_utils/mere-component';
import { NotificationComponent } from 'src/app/compo/notification/notification.component';
import { UserConnectedComponent } from 'src/app/compo/user-connected/user-connected.component';
import { MyError } from 'src/app/resource/MyError';
import { ConsultantService } from 'src/app/service/consultant.service';
import { EsnService } from 'src/app/service/esn.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { DataSharingService } from "../../service/data-sharing.service";
import { UtilsService } from "../../service/utils.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends MereComponent {
  title0 = "Notifications"
  language: string;
  notifications: Notification[]
  nbNotificationNotViewed = 0
  dateStr = ""
  timeStr = ""

  // @ViewChild('infors', {static: false}) infors: MereComponent;

  @ViewChild('notificationCompo', { static: false }) notificationCompo: NotificationComponent;

  constructor(private router: Router
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
    , private esnService : EsnService
    , private consultantService : ConsultantService
    , private utilsIhm: UtilsIhmService
    , public dialog: MatDialog
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit() {

    super.ngOnInit()

    this.language = this.utils.getLocale();
    this.dataSharingService.setHeaderComponent(this);
    // this.dataSharingService.addInfosObservers(this);

    setTimeout(
      () => {
        console.log("UserConnected : ", this.userConnected)

        this.esnService.majEsnOnConsultant(this.userConnected , ()=>{}, (error)=>{
          this.addError(new MyError("", JSON.stringify(error)))
        } )
        this.consultantService.majAdminConsultant(this.userConnected)
        this.getNbNotifications()
      }, 1000
    )

    this.setClock();
    
    // this.dataSharingService.isUserLoggedInFct.subscribe(value => {
    //   this.isUserLoggedIn = value;
    //   if(this.isUserLoggedIn) {
    //     this.userConnected = this.dataSharingService.userConnected
    //     // this.setEsnInUserConnected();
    //   }else {
        
    //   }
    // });

  }

  private setClock() {
    setInterval(
      () => {
        let dateHeure = this.utils.formatDateToDateHeure(new Date);
        let tab = dateHeure.split(' ');
        this.dateStr = tab[0];
        this.timeStr = tab[1];
      }, 1000
    );
  }

  // setEsnInUserConnected() {

  //   if(this.esnName && this.userConnected && this.userConnected.esn) {
  //     return 
  //   }

  //   let nMax = 5
  //   let n = 1;
  //   var x = setInterval(
  //     () => {
  //       // console.log("setInterval esnName : " , this.esnName)
  //       // console.log("setInterval userConnected : " , this.userConnected)

  //       if (!this.esnName && this.userConnected?.role != "ADMIN" && n < nMax) {
  //         n++;
  //         this.esnService.majEsnOnConsultant(this.userConnected);
  //         this.esnName = this.userConnected?.esnName;
  //         if (!this.esnName) this.esnName = this.userConnected?.esn?.name;
  //         console.log("setInterval n, esnName : " , n, this.esnName)
  //       } else {
  //         this.dataSharingService.esnCurrent = this.userConnected?.esn
  //         this.dataSharingService.idEsnCurrent = this.userConnected?.esn?.id 
  //         clearInterval(x);
  //         x = null;
  //         console.log("setInterval exit ", this.esnName);
  //       }
  //     }, 3000
  //   );
  // }

  showCalendar() {
    this.utilsIhm.openCalendarModal()
  }


  showNotificationsAll() {
    this.clearInfos();
    this.router.navigate(['/notification']);
  }

  public getNotifications() {
    // //////////console.log("getListNotifications")

    if (this.notificationCompo) this.notificationCompo.getNotifications();
    this.notifications = this.notificationCompo ? this.notificationCompo.myList : new Array();
    if (!this.notifications) this.notifications = new Array();
    return this.notifications;
  }
  getNbNotifications() {
    // //////////console.log("getNbNotifications")
    // this.getListNotifications();
    this.nbNotificationNotViewed = this.notificationCompo ? this.notificationCompo.nbNotification : 0;
    return this.nbNotificationNotViewed;
  }

  // getNotViewedNotifications() {
  //   this.notificationCompo.getNotViewedNotifications( ); 
  // }

  //ICON USER
  menuUserConnected() {
    if (this.dataSharingService.isLoggedIn()) {

      this.dataSharingService.isDisableSearchStrInput = true;

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "580px";
      dialogConfig.height = "570px";
  
      let dialogRef = this.dialog.open(UserConnectedComponent, dialogConfig);

    }
  }

}
