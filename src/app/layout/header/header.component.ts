import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MereComponent } from 'src/app/compo/_utils/mere-component';
import { NotificationComponent } from 'src/app/compo/notification/notification.component';
import { UserConnectedComponent } from 'src/app/compo/user-connected/user-connected.component';
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

  constructor(private authService: AuthService
    , private router: Router
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
    , private utilsIhm: UtilsIhmService
    , public dialog: MatDialog
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit() {
    this.language = this.utils.getLocale();
    this.dataSharingService.setHeaderComponent(this);
    this.dataSharingService.addInfosObservers(this);

    setInterval(
      () => {
        let dateHeure = this.utils.formatDateToDateHeure(new Date)
        let tab = dateHeure.split(' ');
        this.dateStr = tab[0]
        this.timeStr = tab[1]
      }, 1000
    )
  }

  showCalendar() {
    this.utilsIhm.openCalendarModal()
  }


  showNotificationsAll() {
    this.clearInfos();
    this.router.navigate(['/notification']);
  }

  public getListNotifications() {
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
    if (this.authService.isLoggedIn()) {

      this.dataSharingService.isDisableSearchStrInput = true;

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "580px";
      dialogConfig.height = "570px";
  
      let dialogRef = this.dialog.open(UserConnectedComponent, dialogConfig);

    }
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getUserFullName() {
    let userConnected = DataSharingService.userConnected
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

}
