import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Document } from 'src/app/model/document';
import { NoteFrais } from 'src/app/model/noteFrais';
import { CraService } from 'src/app/service/cra.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { NoteFraisService } from 'src/app/service/note-frais.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Notification } from "../../model/notification";
// 
import { UtilsService } from "../../service/utils.service";
import { MereComponent } from '../_utils/mere-component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent extends MereComponent implements AfterViewInit {

  @Input() isOnlyNotViewed: boolean = false;
  @Input() isShowBtns: boolean = true;
  @Input() idPagination = "idPagination";
  myList: Notification[];
  nbNotification = 0;
  title = "";

  refreshEverySecMin = 5;
  refreshEverySec = 10;  //seconds
  refreshLoopId: any;
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
    , public dataSharingService: DataSharingService
    , protected utilsIhm: UtilsIhmService
    , private craService: CraService
    , private noteFraisService : NoteFraisService
    , private dialog: MatDialog
    , private modal: NgbModal
    , private cdr: ChangeDetectorRef
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit() {
    // S'abonner aux notifications via le BehaviorSubject
    this.dataSharingService.listNotifications$.subscribe(notifications => {
      this.updateNotifications(notifications);
    });
    
    // Charger les notifications initiales
    this.getNotifications(null, null);
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
    var t = "List Notifications"
    if (this.isOnlyNotViewed) t += " Not Viewed"

    this.title = t + " (" + this.getNbElement() + ")";
  }

  refresh() {
    // Assurer un minimum de temps entre chaque refresh
    this.refreshEverySec = Math.max(this.refreshEverySec, this.refreshEverySecMin);
    
    // Toggle le refresh
    if (this.refreshStarted) {
      // Arrêter le refresh
      clearInterval(this.refreshLoopId);
      this.refreshStarted = false;
    } else {
      // Démarrer le refresh silencieux (sans recharger toute la page)
      this.refreshLoopId = setInterval(() => {
        this.refreshNotificationsSilently();
      }, this.refreshEverySec * 1000);
      this.refreshStarted = true;
    }
  }

  /**
   * Rafraîchit uniquement les notifications sans recharger tout l'écran
   */
  private refreshNotificationsSilently() {
    this.dataSharingService.getNotifications(
      (listNotif) => {
        // Mise à jour silencieuse - pas de message, pas de rechargement
        // updateNotifications sera appelé automatiquement via l'observer
      },
      (error) => {
        // Erreur silencieuse - ne pas afficher d'erreur pour un refresh automatique
        console.warn('Refresh automatique des notifications échoué:', error);
      }
    );
  }

  isMyListEmpty() {
    return this.getNbElement() == 0;
  }

  /**
   * 
   * @param listAll called by dataSharingService, after calling it
   */
  updateNotifications(listAll: Notification[]) {
    // Filtrer les notifications si nécessaire
    const newList = this.isOnlyNotViewed 
      ? (listAll || []).filter(n => !n.viewed)
      : listAll;

    // Simple assignment - Angular détectera les changements via trackBy
    this.myList = newList || [];

    this.getNbElement();
    this.setTitle();
    this.myList00 = this.myList;
    
    // Marquer pour vérification au lieu de forcer une détection complète
    this.cdr.markForCheck();
  }

  /**
   * TrackBy function pour optimiser le rendu de la liste
   */
  trackByNotificationId(index: number, notification: Notification): any {
    return notification?.id || index;
  }

  setMyList(myList: any[]) {
    this.myList = myList;
  }

  getNotifications(fctOk: Function, fctKo: Function) {
    this.dataSharingService.getNotifications(fctOk, fctKo);
  }

  findAll() {
    this.dataSharingService.getNotifications(null, null);
  }

  saveNotification(notification: Notification, fctOk?: Function, fctKo?: Function) {
    this.dataSharingService.saveNotification(notification, fctOk, fctKo);
  }

  changeViewed(notification: Notification) {
    if (notification.viewed == null) notification.viewed = false;
    notification.viewed = !notification.viewed;
    this.saveNotification(notification);
  }
  getBulle(notification: Notification) {
    if (notification.viewed == null) notification.viewed = false;
    if (notification.viewed) this.notifBulle = "Set Unread"
    else this.notifBulle = "Set Read"
    return this.notifBulle
  }
  getImgRead(notification: Notification) {
    if (notification.viewed == null) notification.viewed = false;
    if (notification.viewed) this.imgNotification = this.imgRead
    else this.imgNotification = this.imgUnRead
    return this.imgNotification
  }


  deleteNotification(notification: Notification) {
    let mythis = this;
    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec date=" + notification.createdDate, mythis
      , () => {
        mythis.dataSharingService.deleteNotification(notification.id, null, null );
      }
      , () => { }
    );

  }

  getTitle() {
    return "Note de Frais N° " + this.selectedFee.id;
  }

  getTimeAgoNotification(notification: Notification) {

    let dateFrom: Date = new Date();

    if (!notification) return -1;

    var date1: any = notification.createdDate;
    // var date1 : Date = new Date() ;

    let date2 = dateFrom;

    // let typeDate = typeof date1;

    if (typeof date1 == "string") {
      // 2021-06-28T15:36:21.977+0000
      date1 = new Date(notification.createdDate);
    }

    // To calculate the time difference of two dates
    var ms = date2.getTime() - date1.getTime();

    var sTotal = Math.floor(ms / 1000);
    var mnTotal = Math.floor(sTotal / 60);
    var s = sTotal - mnTotal * 60;

    var hTotal = Math.floor(mnTotal / 60);
    var mn = mnTotal - hTotal * 60;

    var dTotal = Math.floor(hTotal / 24);
    var h = hTotal - dTotal * 24;

    return dTotal + " days " + h + " hours " + mn + " mn ";
  }

  showForm(notification: Notification) {
    this.clearInfos();
    notification.viewed = true;
    this.craService.majNotification(notification)
    this.noteFraisService.majNotification(notification)
    
    this.saveNotification(notification);
    
    this.dataSharingService.fromNotif = true;
    
    this.addInfo("show cra en cours ... " + notification.cra?.monthStr, true )

    setTimeout(() => {
      this.dataSharingService.showCra(notification.cra);
    }, 1500);

  }

  showCra(notification: Notification) {
    const label = "showCra";
    console.log(label + " START - notification: ", notification);
    
    if (!notification) {
      console.error(label + " ERROR - notification est null");
      this.addErrorTxt("Notification null");
      return;
    }
    
    if (!notification.cra) {
      console.error(label + " ERROR - notification.cra est null");
      this.addErrorTxt("CRA non trouvé dans la notification");
      return;
    }

    // Update current CRA via service to notify all subscribers
    this.dataSharingService.notifyCraUpdated(notification.cra);

    let cra = this.dataSharingService.getCurrentCra();
    console.log(label + " - Current CRA après notifyCraUpdated: ", cra);
    
    console.log(label + " - notification.cra: ", notification.cra);

    this.clearInfos();
    notification.viewed = true;
    
    console.log(label + " - appel craService.majNotification");
    this.craService.majNotification(notification,
      ()=>{
        console.log(label + " - callback craService.majNotification OK");
        
        console.log(label + " - appel noteFraisService.majNotification");
        this.noteFraisService.majNotification(notification, 
          ()=>{
            console.log(label + " - callback noteFraisService.majNotification OK");
            
            this.saveNotification(notification, (data)=>{
              console.log(label + " - callback saveNotification OK: ", data);
              this.dataSharingService.fromNotif = true;
              
              console.log(label + " - appel dataSharingService.showCra");
              this.dataSharingService.showCra(cra);
              // this.dataSharingService.showCra(this.dataSharingService.getCurrentCra());
              console.log(label + " END - showCra appelé");

            }, (error)=>{
              console.error(label + " - ERREUR saveNotification: ", error);
            });
            
          }
        )
      }, 
      true 
    );
    
  }

  showFee(notification: Notification) {
    this.selectedFee = notification.noteFrais;
    console.log("showFee", notification)
    this.modal.open(this.detailsFeeView, { size: 'lg' });
    this.clearInfos();
    notification.viewed = true;
    this.saveNotification(notification);

    this.dataSharingService.fromNotif = true;
    // this.dataSharingService.showFeeViaLoading(notification.currentFee);
  }

  showDocument(notification: Notification) {
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
