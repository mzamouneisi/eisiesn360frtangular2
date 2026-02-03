import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { ActivityType } from "../../../model/activityType";
import { Cra } from "../../../model/cra";
import { CraDay } from "../../../model/cra-day";
import { CraStatusHisto } from "../../../model/cra-status-histo.model";
import { ActivityService } from '../../../service/activity.service';
import { CraService } from '../../../service/cra.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarView
} from 'angular-calendar';
import {
  endOfDay,
  startOfDay,
} from 'date-fns';

import { Subject } from "rxjs";
import { Consultant } from 'src/app/model/consultant';
import { Activity } from "../../../model/activity";
import { CraDayActivity } from "../../../model/cra-day-activity";
import { DataSharingService } from "../../../service/data-sharing.service";
import { UtilsService } from "../../../service/utils.service";
// import {NotifierService} from "angular-notifier";
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CraContext } from 'src/app/core/model/cra-context';
import { Notification } from 'src/app/model/notification';
import { ActivityTypeService } from 'src/app/service/activityType.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { CraObservable, CraObserver } from "../../../core/core";
import { CraReportActivity } from "../../../model/cra-report-activity";
import { ClientsDialogComponent } from '../../_dialogs/ClientsDialogComponent';
import { CraHistoStatusComponent } from '../../_dialogs/CraHistoStatusComponent';
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';
import { AddMultiDateComponent } from "../add-multi-date/add-multi-date.component";

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#2E8B57',
    secondary: '#D1E8FF'
  }
};

@Component({
  selector: 'app-cra-form-cal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cra-form-cal.component.html',
  styleUrls: ['./cra-form.component.css']
})
export class CraFormCalComponent extends MereComponent implements CraObserver {

  @ViewChild('dayDetailView', { static: true }) dayDetailView: TemplateRef<any>;
  @ViewChild('addActivityView', { static: true }) addActivityView: TemplateRef<any>;
  @ViewChild('rejectCraView', { static: true }) rejectCraView: TemplateRef<any>;
  @ViewChild('raddMultiDateComponent', { static: true }) addMultiDateComponent: TemplateRef<any>;
  @ViewChild('showCraReportPdfView', { static: true }) showCraReportPdfView: TemplateRef<any>;
  @ViewChild('attachment', { static: true }) attachment: ElementRef;

  refresh: Subject<any> = new Subject();

  title = "CraFormCal"

  isAdd: string;
  typeCra: string;
  @Input() currentCra: Cra;

  btnActionTitle: string;
  craDayActivity: CraDayActivity = new CraDayActivity();
  craDay: CraDay;
  daySelected: any;
  daySelectedStr: string; // yyyy-mm-dd
  dateOfDaySelected: Date;
  isDaySelectedInCurentMonth = false;

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[];

  activities: Activity[];

  times: number[] = [0.5, 1]

  widthDevisEntete00 = "33%"
  widthDevisEntete = "33%"

  totalDayToWork: number;
  numberDayAbs: number;
  numberDayWorked: number;
  numberDayBilled: number;
  totalBilled: number;  // en TJM

  isEditCraActivity: boolean = false;
  currentCraUser: Consultant = null;  //user of cra
  userConnected: Consultant = null;  //user connected

  craReportActivities: CraReportActivity[];

  isAffWeekNumber = true;
  titleShowWeekNumber = 'Hide Week Number';

  isAddMultiDate = false;
  addMultiDateStartDate!: Date;
  addMultiDateEndDate!: Date;

  isToRejectCra = false;
  isToValidateCra = false;

  showWeekNumber() {
    // //////////console.log("DBG showWeekNumber")
    if (this.isAffWeekNumber) this.titleShowWeekNumber = 'Show Week Number';
    else this.titleShowWeekNumber = 'Hide Week Number';

    this.isAffWeekNumber = !this.isAffWeekNumber;
  }


  constructor(private route: ActivatedRoute, private router: Router
    , private craService: CraService
    , private consultantService: ConsultantService
    // , private craFormsService: CraFormsService
    , private activityService: ActivityService
    , private activityTypeService: ActivityTypeService
    , private modal: NgbModal
    // , private notifier: NotifierService
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
    , private utilsIhm: UtilsIhmService
    , private datePipe: DatePipe
    , public dialog: MatDialog
  ) {
    super(utils, dataSharingService);
    console.log("DBG: cra-form-cal: constructot: currentCra: ", this.currentCra)
    console.log("cra list findAll Constr : dataSharingService.listCra:", this.dataSharingService.getListCra())
  }

  // getCurrentCra() {
  //   // //////////console.log("DBG: cra-form-cal: getCurrentCra(): currentCra: ", this.currentCra)
  //   return this.currentCra;
  // }

  /**
   * s'il ne vient pas d'un input , il peut venir des params de l'url
   */

  ngOnInit(): void {

    console.log("ngOnInit deb dataSharingService.listCra, dataSharingService.fromNotif", this.dataSharingService.getListCra(), this.dataSharingService.fromNotif);

    // eviter d'entrer si on vient de nulle part
    if (!this.dataSharingService.getListCra() && !this.dataSharingService.fromNotif) {
      this.gotoCraList();
    }

    this.userConnected = this.getCurrentUserFromLocaleStorage();
    this.setUserConnected(this.userConnected)

    console.log("ngOnInit userConnected : ", this.userConnected)

    console.log("ngOnInit viewDate : ", this.viewDate)
    if (this.notADate(this.viewDate)) {
      this.viewDate = new Date();
      console.log("ngOnInit viewDate was not a date : the new is : ", this.viewDate)
    }
    this.viewDate = this.utils.getDate(this.viewDate);
    console.log("ngOnInit viewDate finalement : ", this.viewDate)

    console.log("cra list findAll av call initParams : dataSharingService.listCra:", this.dataSharingService.getListCra())

    this.initParams();

    console.log("cra list findAll ap call initParams : dataSharingService.listCra:", this.dataSharingService.getListCra())

    this.dataSharingService.addService(this);

    console.log("cra list findAll ap call addService : dataSharingService.listCra:", this.dataSharingService.getListCra())

    console.log("ngOnInit isAdd : ", this.isAdd)
    console.log("ngOnInit currentCraUser : ", this.currentCraUser)


    if (this.isAdd == "true") {
      this.currentCraUser = this.userConnected;
      console.log("ngOnInit currentCraUser : ", this.currentCraUser)
    } else {
      this.findConsultantOfCurrentCra();
    }

    this.findAllActivities();

    console.log("ngOnInit currentCra.consultantId : ", this.currentCra.consultantId)
    this.setCurrentCraConsultantId()

    this.consultantService.majAdminConsultant(this.userConnected)

    this.consultantService.majCra(this.currentCra);

    this.statusHistoJsonToTab()

    console.log("cra list findAll ap call majCra : dataSharingService.listCra:", this.dataSharingService.getListCra())
    console.log("cra list findAll ap call majCra : currentCra:", this.currentCra)

    // this.showCra(this.currentCra)

    console.log("+++ ngOnit FIN");

  }

  getClassForStatus(): string {
    switch (this.currentCra?.status) {
      case 'VALIDATED':
        return "btn-outline-success";
      case 'REJECTED':
        return "btn-outline-danger";
      default:
        return "btn-outline-primary";
    }
  }

  changeTypeToCra() {
    if (this.currentCra) {
      this.currentCra.type = "CRA"
      this.typeCra = this.currentCra.type
      this.setStatus("DRAFT")
      this.currentCra.validByConsultant = false
      this.currentCra.validByManager = false
    }
  }

  addStatusHisto() {
    if (this.currentCra) {

      if (!this.currentCra.statusHistoTab) {
        this.currentCra.statusHistoTab = []
      }

      let histo = new CraStatusHisto();
      histo.dateStatus = new Date()
      histo.status = this.currentCra.status
      histo.typeCra = this.currentCra.type
      histo.userConnected = this.userConnected
      this.currentCra.statusHistoTab.push(histo)

      this.statusHistoTabToJson()
    }
  }

  statusHistoJsonToTab() {
    if (!this.currentCra.statusHistoJson) {
      this.currentCra.statusHistoJson = "[]"
      this.currentCra.statusHistoTab = []
    } else {
      this.currentCra.statusHistoTab = JSON.parse(this.currentCra.statusHistoJson)
    }
  }

  statusHistoTabToJson() {
    if (!this.currentCra.statusHistoTab) {
      this.currentCra.statusHistoJson = "[]"
      this.currentCra.statusHistoTab = []
    } else {
      this.currentCra.statusHistoJson = JSON.stringify(this.currentCra.statusHistoTab)
    }
  }

  setCurrentCraConsultantId() {
    console.log("DBG: setCurrentCraConsultantId currentCra.consultantId DEB : ", this.currentCra.consultantId)
    if (!this.currentCra.consultantId) {
      if (this.currentCra.consultant && this.currentCra.consultant.id) {
        this.currentCra.consultantId = this.currentCra.consultant.id
        console.log("DBG: setCurrentCraConsultantId currentCra.consultantId 1 : ", this.currentCra.consultantId)
        console.log("+++ saveCra : change 02 of consultant of currentCra ", this.currentCra)
      } else {
        this.currentCra.consultantId = this.userConnected.id
        console.log("DBG: setCurrentCraConsultantId currentCra.consultantId 2 : ", this.currentCra.consultantId)
        console.log("+++ saveCra : change 03 of consultant of currentCra ", this.currentCra)
      }
    }
  }

  initParams() {
    console.log("DBG: initParams: currentCra : ", this.currentCra)
    console.log("DBG: initParams: isAdd : ", this.isAdd)

    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
      if (this.isAdd == null) {
        this.isAdd = this.dataSharingService.isAdd;
      }
    }
    if (this.typeCra == null) {
      this.typeCra = this.route.snapshot.queryParamMap.get('typeCra');
      if (this.typeCra == null) {
        this.typeCra = this.dataSharingService.typeCra;
      }
    }

    if (this.currentCra == null) {
      console.log("DBG: initParams: currentCra = null")
      if (this.isAdd != "true") {
        // Essayer de récupérer le CRA depuis le state de la route
        const navigationExtras = this.router.getCurrentNavigation()?.extras;
        if (navigationExtras?.state?.cra) {
          this.currentCra = navigationExtras.state.cra;
          console.log("DBG: initParams: CRA récupéré du state de la route : ", this.currentCra)
        } else {
          // Sinon, récupérer depuis le service
          this.currentCra = this.dataSharingService.getCurrentCra();
          console.log("DBG: initParams: dataSharingService.currentCra : ", this.currentCra)
        }
      }
    }

    console.log("showCra cra-form ", this.currentCra)

    this.currentCraUser = this.currentCra?.consultant

    if (this.currentCra == null) {
      console.log("DBG: initParams: mode new Cra ")
      this.currentCra = new Cra();
      this.isAdd = "true"
    }

    // save pour la navigation :
    this.dataSharingService.isAdd = this.isAdd;
    this.dataSharingService.typeCra = this.typeCra;

    console.log("initParams isAdd, typeCra, currentCra : ", this.isAdd, this.typeCra, this.currentCra);
  }

  getCurrentCraFromContext() {
    console.log("DBG: getCurrentCraFromContext: ", this.currentCra)
    this.beforeCallServer(this.title)
    this.dataSharingService.getCurrentCraContext()
      .subscribe(
        (context) => {
          this.afterCallServer(this.title, context)
          ////////console.log("+++ ngOnit context", context);
          if (context != null) {
            // //////////console.log("DBG: cra-form-cal: context non NULL: context: ", context)
            this.currentCra = context.cra;
            this.events = context.events;
            this.viewDate = context.viewDate;
            if (this.notADate(this.viewDate)) this.viewDate = new Date();
            this.viewDate = this.utils.getDate(this.viewDate);
            this.dataSharingService.onCraDestroy();
            this.statusHistoJsonToTab()

          }
          // //////////console.log("DBG: cra-form-cal: ngOnint(): FIN currentCra: ", this.currentCra)

        }, error => {
          this.addErrorFromErrorOfServer(this.title, error);
          //////////console.log("+++ ngOnit error:", error);
        }
      )
  }

  findConsultantOfCurrentCra() {
    console.log("DBG: findConsultantOfCurrentCra: ", this.currentCra)
    let username: string = this.currentCra.consultant?.username;
    if (username != null) {
      this.beforeCallServer("findConsultantByUsername")
      this.dataSharingService.findConsultantByUsername(username,
        (data, user) => {
          this.afterCallServer("findConsultantByUsername", data)
          this.currentCraUser = user;

          this.findAllActivities();

        },
        (error) => {
          this.addErrorFromErrorOfServer("findConsultantByUsername", error);
        }
      );

    } else {

    }
  }


  /****
   * used to retrieve cra activity
   */
  private findAllActivities() {
    if (!this.currentCraUser) this.currentCraUser = this.currentCra?.consultant
    if (!this.currentCraUser) this.currentCraUser = this.userConnected

    console.log("*************** findAllActivities deb currentCraUser : ", this.currentCraUser);
    let info_id = "findAllActivities currentCraUser : " + this.currentCraUser?.fullName
    this.beforeCallServer(info_id);
    this.activityService.findAllByConsultant(this.currentCraUser.id).subscribe(
      data => {
        this.afterCallServer(info_id, data)
        console.log("*************** findAllActivities data : ", data);
        if (data == null) {
          this.activities = new Array();
        } else {
          this.activities = data.body.result;
          console.log("*************** findAllActivities activities 1 : ", this.activities);
          let list = []
          for (let ac of this.activities) {
            console.log("*************** findAllActivities ac : ", ac);
            console.log("*************** findAllActivities ac.valid : ", ac.valid);
            if (ac.valid == true) {
              if (this.typeCra == "CONGE") {
                // if (ac.type && ac.type.congeDay) {
                //   list.push(ac)
                // }
                list.push(ac)
              } else {
                list.push(ac)
              }
            }
          }
          this.activities = list;
          console.log("*************** findAllActivities activities 2 : ", this.activities);
        }
        //////////console.log("*************** findAllActivities activities:", this.activities);
        ////////console.log("*************** findAllActivities isAdd:", this.isAdd);
        //
        console.log("*************** findAllActivities isAdd : ", this.isAdd);
        if (this.isAdd == 'true') {

          if (this.typeCra == 'CONGE') {
            this.currentCra.type = 'CONGE';
          } else {
            this.currentCra.type = 'CRA';
          }

          this.viewDateChange(false);

        } else {

          // this.getCurrentCraFromContext();
          this.currentCra = this.dataSharingService.getCurrentCra();
          console.log("*************** findAllActivities get cra from dataSharingService : ", this.currentCra);

          if (!this.currentCra) {
            this.currentCra = this.craService.getCra();
            console.log("*************** findAllActivities get cra from craService : ", this.currentCra);
          }
          this.initCra(this.currentCra);
          this.btnActionTitle = "UPDATE " + this.getNameByType();
        }
        //
        this.process();
        this.refreshMe();

        //////////console.log("************ findAllActivities fin");
      }, error => {
        //////////console.log("+++ findAllActivities error", error)
        this.addErrorFromErrorOfServer(info_id, error);
      }
    );
  }

  /***
   * Used to initialized cra
   */
  initCra(currentCra: Cra) {
    console.log("+++ initCra deb currentCra", currentCra);
    if (currentCra != null && currentCra.craDays != null) {
      this.deleteCraDayActivitiesOfActivityNullInCra(currentCra)
      this.viewDate = currentCra.month;
      // console.log("+++ initCra currentCra.month", currentCra.month);
      if (this.notADate(this.viewDate)) this.viewDate = new Date();
      this.viewDate = this.utils.getDate(this.viewDate);
      // console.log("+++ initCra viewDate", this.viewDate);
      this.events = [];
      // console.log("+++ initCra currentCra.craDays", currentCra.craDays);
      currentCra.craDays.forEach((v, k) => {
        if (v.craDayActivities != null) {
          v.craDayActivities.forEach((value, index) => {
            // ////////console.log("+++ initCra av setEvent v, value:", v, value);
            this.setEvent(v, value, false);
            // console.log("+++ initCra ap setEvent v, k, value : ", v, k, value);
          })
        }
      })

      this.initDatesDebFinMultiDates();

      this.statusHistoJsonToTab()

    }
    console.log("+++ initCra fin");
  }

  addActivitiesOfCra(cra: Cra) {
    console.log("addActivitiesOfCra deb this.currentCra=", this.currentCra)
    cra.craDays.forEach((craDay, k) => {

      this.craDay = this.getNewCraDayFrom(craDay);
      //////console.log("craDay", i, craDay)

      let isSet = this.craService.setCraDayInCraByDate(this.currentCra, this.craDay.day, this.craDay, false)
      ////console.log("** isSet="+isSet)

    })

    console.log("addActivitiesOfCra fin this.currentCra=", this.currentCra)

  }

  getNewCraDayActivityFrom(craDayActivity: CraDayActivity): CraDayActivity {
    // console.log("getNewCraDayActivityFrom this.currentCra=", this.currentCra)
    let cda = new CraDayActivity();
    cda.activity = craDayActivity.activity;
    cda.endHour = craDayActivity.endHour;
    cda.isOverTime = craDayActivity.isOverTime;
    cda.nbDay = craDayActivity.nbDay;
    cda.startHour = craDayActivity.startHour;

    return cda;
  }

  getNewCraDayFrom(craDay: CraDay): CraDay {
    console.log("getNewCraDayFrom this.currentCra=", this.currentCra)
    let cd = new CraDay();
    cd.craDayActivities = []
    cd.day = craDay.day;
    cd.dayAbs = craDay.dayAbs;
    cd.dayBill = craDay.dayBill
    cd.isDayWorked = craDay.isDayWorked

    if (craDay.craDayActivities != null) {
      for (let i = 0; i < craDay.craDayActivities.length; i++) {
        this.craDayActivity = this.getNewCraDayActivityFrom(craDay.craDayActivities[i]);
        //////console.log("craDayActivity", i, craDayActivity)
        this.addActivity(this.craDayActivity, cd, false);
      }
      this.process();
    }

    return cd;
  }

  notADate(date: Date): boolean {
    return !date || date + "" == "Invalid Date";
  }

  setMonthCurentCraIfNull() {
    if (this.notADate(this.viewDate)) this.viewDate = new Date();
    if (this.notADate(this.currentCra.month)) this.currentCra.month = this.viewDate;
  }

  viewDateChange(isClearInfos: boolean) {

    let label = "viewDateChange"

    console.log(label + " deb viewDate:", this.viewDate)

    if (isClearInfos) this.clearInfos();

    this.btnActionTitle = "SAVE " + this.getLabelByType();

    if (this.notADate(this.viewDate)) this.viewDate = new Date();
    this.viewDate = this.utils.getDate(this.viewDate);

    console.log(label + " after : viewDate:", this.viewDate)

    // this.viewDate est un objet Date au 1er
    this.initDatesDebFinMultiDates();

    /**
     * si existe un cra validee , afficher le
     */

    let craInDateView: Cra = this.craService.getCraInDate(this.viewDate, this.dataSharingService.getListCra());
    console.log(label + " craInDateView", craInDateView)

    if (craInDateView != null) {
      console.log("showCra valide deb")

      this.statusHistoJsonToTab()

      this.showCra(craInDateView);

      // this.addErrorTitleMsg("Error Add " + this.getLabelByType(), "On ne peut pas ajouter un nouveau "+this.getLabelByType()+" lorsqu'il y'a deja un CRA valide ce mois-ci !")

      console.log("showCra valide fin")

    } else {
      this.beforeCallServer(label)
      console.log("before getNewCraOfDate : viewDate ", this.viewDate)
      this.craService.getNewCraOfDate(this.viewDate).subscribe(
        data => {
          console.log(label + " : viewDate, data : ", this.viewDate, data)
          this.afterCallServer(label, data)
          if (data != null && data.body != null && data.body.result != null) {
            console.log("we have a new cra from initCra du server. data", data)
            this.currentCra = data.body.result;

            this.statusHistoJsonToTab()

            // console.log("monthStr = " + this.currentCra.monthStr )
            // this.currentCra.month = new Date(this.currentCra.monthStr);
            this.setMonthCurentCraIfNull();
          } else {
            console.log("set new Cra of this viewDate ", this.viewDate)
            this.currentCra = new Cra();
            this.setMonthCurentCraIfNull();
            this.events = [];
          }

          console.log(label + " currentCra : ", this.currentCra)

          if (!this.getError() || this.getError().length == 0) {
            // this.addActivitiesValidOfThisMonth();
            // this.currentCra.month = this.viewDate;

            ////////console.log(label+" goto showCra", this.currentCra)
            // this.dataSharingService.showCra(this.currentCra);

            this.setMonthCurentCraIfNull();

            let craContext: CraContext = new CraContext();
            let month = this.utils.getDate(this.currentCra.month);
            craContext.cra = this.currentCra;
            craContext.viewDate = month;
            // //////////console.log("+++++ showCra cra, month:", cra, month)
            craContext.events = [];
            this.dataSharingService.onCraInit(craContext);
            // this.router.navigate(["/cra_form"])
            ////////console.log("showCra fin", cra)

            this.addCongesValidOfDate(this.viewDate);

            this.initCra(this.currentCra);
            this.process();
            this.refreshMe();

          } else {
            for (let error of this.getError()) {
              this.addErrorFromErrorOfServer(label, error);
            }
          }
        }, error => {
          this.addErrorFromErrorOfServer(label, error);
        })
    }

    console.log(label + " fin currentCra ", this.currentCra)

  }

  private initDatesDebFinMultiDates() {
    this.addMultiDateStartDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);

    // Calcul de la dernière date du mois de this.viewDate
    this.addMultiDateEndDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);
  }

  showCra(cra: Cra) {

    this.currentCra = cra;

    // this.findConsultantOfCurrentCra();

    this.initCra(this.currentCra);
    this.process();
    this.refreshMe();
  }

  addCongesValidOfDate(date: Date) {
    console.log("add_conges_of_date this.currentCra=", this.currentCra)
    let listCra: Cra[] = []
    // let listConge : Cra[] = []
    let month = this.datePipe.transform(date, 'yyyy-MM');

    let label = "getValidatedCraByConsultantAndDate";
    this.beforeCallServer(label);
    this.craService.getValidatedCraByConsultantAndDate(this.currentCraUser.username, month).subscribe(
      (data) => {
        this.afterCallServer(label, data);
        //////console.log("data:", data)
        listCra = data.body.result;
        //////console.log("listCra:", listCra)
        // if (!this.isError && !this.utils.isListEmpty(listCra) ) listCra = listCra.sort((a, b) => this.compareCraDesc(a, b))
        if (listCra) {
          for (let cra of listCra) {
            if (cra.type == "CONGE") {
              //listConge.push(cra);
              //TODO 
              this.addActivitiesOfCra(cra)
            }
          }
        }

      }, (error) => {
        this.addErrorFromErrorOfServer(label, error);
        //console.log(error);
      }
    );
  }

  errorDates = "";
  onStartDateInputChanged(date: Date, error: string) {
    console.log("onStartDateInputChanged this.currentCra=", this.currentCra)
    this.addMultiDateStartDate = date;
    this.errorDates = error;
    ////////////console.log("main onChangeDateDeb myDatePickerDeb", date, error);
    if (this.errorDates) {
      this.utils.showNotification("error", "The end date of project you have been above of the start date !")
    }
  }

  onEndDateInputChanged(date: Date, error: string) {
    console.log("onEndDateInputChanged this.currentCra=", this.currentCra)
    // this.addMultiDateEndDate=new Date(date.getTime() + 24*60*60*1000);  //debug du fin-1
    this.addMultiDateEndDate = date;
    this.errorDates = error;
    ////////////console.log("main onChangeDateDeb myDatePickerDeb", date, error);
    if (this.errorDates) {
      this.utils.showNotification("error", "The end date of project you have been above of the start date !")
    }
  }

  getTypeDay(dayDate: Date) {
    // console.log("*** getTypeDay deb", dayDate)

    let type = "";
    if (this.currentCra) {
      for (let i = 0; i < this.currentCra.craDays.length; i++) {
        let craDay = this.currentCra.craDays[i];
        if (this.utils.formatDate(craDay.day) == this.utils.formatDate(dayDate)) {
          type = craDay.type
          // //////////console.log("*** getTypeDay fin1", type)
          return type
        }
      }
    }
    // //////////console.log("*** getTypeDay fin2", type)
    return type;
  }

  isDayConge(dayDate: Date) {
    // console.log("*** isDayConge deb", dayDate)
    let isDayConge = false;
    if (this.currentCra) {
      for (let i = 0; i < this.currentCra.craDays.length; i++) {
        let craDay = this.currentCra.craDays[i];
        if (this.utils.formatDate(craDay.day) == this.utils.formatDate(dayDate)) {
          for (let i = 0; i < craDay.craDayActivities.length; i++) {
            let cda: CraDayActivity = craDay.craDayActivities[i];
            let activity: Activity = cda.activity;
            let activityType: ActivityType = activity ? activity.type : null;
            let activityTypeName: string = activityType ? activityType.name : "";
            if (activityType && activityType.congeDay) {
              isDayConge = true;
              // //////////console.log("*** isDayConge fin1", isDayConge)
              return isDayConge;
            }
          }
          // //////////console.log("*** isDayConge fin2", isDayConge)
          return isDayConge;
        }
      }
    }
    // //////////console.log("*** isDayConge fin3", isDayConge)
    return isDayConge;
  }

  isDayBilled(dayDate: Date) {
    // console.log("*** getTypeActivity dayDate", dayDate)
    let res = false;
    if (this.currentCra) {
      for (let i = 0; i < this.currentCra.craDays.length; i++) {
        let craDay = this.currentCra.craDays[i];
        if (this.utils.formatDate(craDay.day) == this.utils.formatDate(dayDate)) {
          let firstActivity = true;
          for (let i = 0; i < craDay.craDayActivities.length; i++) {
            let cda: CraDayActivity = craDay.craDayActivities[i];
            let activity: Activity = cda.activity;
            let activityType: ActivityType = activity ? activity.type : null;
            let activityTypeName: string = activityType ? activityType.name : "";
            // ////////console.log("*** getTypeActivity dayDate: ", dayDate)
            // ////////console.log("*** getTypeActivity activityType ", activityType)
            // ////////console.log("*** getTypeActivity activityTypeName: ", activityTypeName)
            if (activityType) {
              if (firstActivity) {
                res = true;
                firstActivity = false;
              }

              res = res && activityType.billDay;
            }
          }
          // //////////console.log("*** isDayConge fin2", isDayConge)
          return res;
        }
      }
    }
    // //////////console.log("*** isDayConge fin3", isDayConge)
    return res;
  }

  getClassOfDay(day) {
    // console.log("*** getClassOfDay deb", day)
    let type = this.getTypeDay(day);
    let klass = "";

    if (type == 'HOLIDAY') {
      klass = "holiday";
    } else if (type == 'CONGE_PAYE') {
      klass = "conge";
    } else {
      klass = 'cal-cell-normal'
    }

    if (this.isDayInViewMonth(day) && !this.isDayBilled(day)) {
      klass = 'free';
      ////////console.log("************ getClassOfDay day, type, klass", day, type, klass)
    }

    let isDayConge = this.isDayConge(day);
    if (isDayConge) klass = 'conge';

    // ////////console.log("************ getClassOfDay day, type, klass", day, type, klass)

    ////////console.log("*** getClassOfDay fin", klass)
    return klass;

  }


  getWidthDivsEntete() {
    let w = this.widthDevisEntete;
    // if(this.isAdd && this.getConsultant(this.currentCra) == null ) w="33%"
    // if(this.isAdd && this.getConsultant(this.currentCra) != null ) w="33%"
    // if(!this.isAdd && this.getConsultant(this.currentCra) != null ) w="33%"
    // //console.log(w)
    return w;
  }

  isDayInViewMonth(day) {
    // console.log("isDayInViewMonth this.currentCra=", this.currentCra)
    if (day) {
      return this.viewDate.getMonth() == this.utils.getDate(day).getMonth();
    } else {
      return false;
    }
  }

  /***
   * the action listener of the day clicked
   * { day, events }: { day: Date; events: CalendarEvent[] }
   * @param day
   */
  dayClicked(day: any, events: any, event: any): void {
    console.log("dayClicked this.currentCra=", this.currentCra)

    // this.isDayBilled(day)

    this.daySelected = day;
    this.daySelectedStr = this.utils.formatDate(day)
    this.dateOfDaySelected = this.daySelected.date;

    this.viewDate = this.utils.getDate(this.viewDate)

    this.isDaySelectedInCurentMonth = this.isDayInViewMonth(this.dateOfDaySelected);

    if (!this.currentCra.validByConsultant) {
      this.craDay = this.craService.getCraDayByDate(this.currentCra, this.daySelected);
      if (this.craDay) {
        if (this.craDay.craDayActivities.length == 0) {
          this.craDayActivityNew();
        } else {
          this.modal.open(this.dayDetailView, { size: 'lg' });
        }
      }
    } else {
      this.utilsIhm.info("CRA deja valide. On ne peut pas le modifier.", null, null);
    }
  }

  isEnableAddCraActivity(): boolean {
    console.log("isEnableAddCraActivity this.currentCra=", this.currentCra)
    let craDayActivities: CraDayActivity[] = this.craDay.craDayActivities;

    let ok = true;

    if (craDayActivities.length > 0) {
      let numberDays: number = 0;
      craDayActivities.forEach(value => {
        numberDays += value.nbDay;
      })
      ok = numberDays < 1;
    }
    console.log("isEnableAddCraActivity ok, this.currentCra : ", ok, this.currentCra)
    return ok;
  }

  craDayActivityNew(): void {
    console.log("craDayActivityNew this.currentCra=", this.currentCra)

    if (!this.isDaySelectedInCurentMonth) return;

    this.craDayActivity = new CraDayActivity()
    this.modal.open(this.addActivityView, { size: 'lg' });
  }

  // // this.craDayActivity.startHour = this.currentCra.monthStr
  // this.craDayActivity.startHour = "01/09/2025"
  // this.craDayActivity.startHour = "30/09/2025"

  addMultiActivity() {

    console.log("addMultiActivity this.currentCra=", this.currentCra)

    this.isAddMultiDate = true;
    this.isDaySelectedInCurentMonth = true;

    this.craDayActivity = new CraDayActivity()

    // this.addMultiDateStartDate = this.viewDate
    // this.addMultiDateEndDate = this.viewDate

    console.log("---- addMultiActivity: addMultiDateStartDate ", this.addMultiDateStartDate)

    let refModal = this.modal.open(this.addActivityView, { size: 'lg' });
    refModal.result.then((result) => {
      this.isEditCraActivity = false
      this.isAddMultiDate = false;
      this.isDaySelectedInCurentMonth = false;
      ////////////console.log("EXIIIIIIIIT NORMAL")
      this.craService.setEventTitle(this.craDay, this.events);
    }, (reason) => {
      this.isEditCraActivity = false
      this.isAddMultiDate = false;
      this.isDaySelectedInCurentMonth = false;
      ////////////console.log("EXIIIIIIIIT AUTRE")
      this.craService.setEventTitle(this.craDay, this.events);
    }
    );

  }

  craDayActivityEdit(craDayActivity: CraDayActivity) {

    console.log("craDayActivityEdit this.currentCra=", this.currentCra)

    this.isEditCraActivity = true
    this.craDayActivity = craDayActivity;
    ////console.log(this.craDayActivityCurrent)

    //TODO replace by ???
    // this.activityForm = this.utils.getFormGroup(this.fb, this.activities, this.craDayActivityCurrent.activity.id, this.craDayActivityCurrent.activity, "activityControl")
    // this.timesForm = this.utils.getFormGroup(this.fb, this.times, this.getIndexOfTime(this.craDayActivityCurrent.nbDay), this.craDayActivityCurrent, "timesControl", false)
    let refModal = this.modal.open(this.addActivityView, { size: 'lg' });
    refModal.result.then((result) => {
      this.isEditCraActivity = false
      ////////////console.log("EXIIIIIIIIT NORMAL")
      this.craService.setEventTitle(this.craDay, this.events);
    }, (reason) => {
      this.isEditCraActivity = false
      ////////////console.log("EXIIIIIIIIT AUTRE")
      this.craService.setEventTitle(this.craDay, this.events);
    }
    );
  }

  getTitleAddCraDayActivity() {

    // console.log("getTitleAddCraDayActivity this.currentCra=", this.currentCra)

    let name = this.getNameByType();
    let month = this.utils.formatDateToMonth(this.viewDate);

    if (this.isEditCraActivity) {
      return "Edit " + name + " Day Activity of " + month;
    } else return "Add new " + name + " Day Activity of " + month;
  }

  craDayActivityDelete(index: number) {

    console.log("craDayActivityDelete this.currentCra=", this.currentCra)

    let craActivity: CraDayActivity = this.craDay.craDayActivities[index];

    let indexEvent = this.craService.getIndexEventOfCraActivity(this.craDay, craActivity, this.events)
    //////////console.log("craDayActivityDelete:", index, craActivity, indexEvent)

    if (indexEvent >= 0) {
      this.craDay.craDayActivities.splice(index, 1)
      // maj des times :
      this.craService.setNbDay(this.craDay);
      //refresh view
      this.events.splice(indexEvent, 1);

      this.craService.setEventTitle(this.craDay, this.events);

      //save
      this.currentCra = this.craService.updateCraDay(this.currentCra, this.craDay);
      this.process();
      this.refreshMe();
    }

  }

  deleteCraDayActivitiesOfActivityNullInCra(cra: Cra) {

    console.log("deleteCraDayActivitiesOfActivityNullInCra this.currentCra=", this.currentCra)

    if (cra != null && cra.craDays != null) {
      for (let i = 0; i < cra.craDays.length; i++) {
        this.deleteCraDayActivitiesOfActivityNull(cra.craDays[i])
      }
    }
  }

  deleteCraDayActivitiesOfActivityNull(craDay: CraDay) {

    console.log("DDDDDDDD deleteCraDayActivitiesOfActivityNull deb")

    let craDayActivities: CraDayActivity[] = [];
    if (craDay != null && craDay.craDayActivities != null) {
      for (let i = 0; i < craDay.craDayActivities.length; i++) {
        if (craDay.craDayActivities[i].activity != null) {
          // //////////console.log("DDDDDDDD deleteCraDayActivitiesOfActivityNull push:", craDay.craDayActivities[i])
          craDayActivities.push(craDay.craDayActivities[i])
        }
      }
      // //////////console.log("DDDDDDDD deleteCraDayActivitiesOfActivityNull fin")
      craDay.craDayActivities = craDayActivities;
    }
  }

  gotoCraList() {

    console.log("gotoCraList this.currentCra=", this.currentCra)

    this.clearInfos();
    this.router.navigate(['/cra_list']);
  }

  /****
   * used to persist or update cra/conge
   */
  saveCra(redirectToList: boolean, isSendNotification: boolean, title, message): void {

    console.log("saveCra isSendNotification, currentCra : ", isSendNotification, this.currentCra)

    if (!this.currentCra.consultant && this.currentCra.status != 'REJECTED' && this.currentCra.status != 'VALIDATED') {
      this.currentCra.consultant = this.userConnected;
      console.log("+++ saveCra : change 01 of consultant of currentCra ", this.currentCra)
    }
    this.setCurrentCraConsultantId()

    this.setMonthCurentCraIfNull();

    // this.consultantService.majCra(this.currentCra);
    if (!this.currentCra.consultant) {
      console.log("+++ saveCra : cat No consultant of currentCra ")
      this.consultantService.findById(this.currentCra.consultantId).subscribe(
        data => {
          console.log("+++ saveCra : set consultant ", data)
          this.currentCra.consultant = data.body.result;
          console.log("+++ saveCra : after call server consultant of currentCra is : ", this.currentCra.consultant)
          console.log("+++ saveCra : change 04 of consultant of currentCra ", this.currentCra)

          this.saveCraDirect(redirectToList, isSendNotification, title, message);
        },
        error => {
          console.log("ERROR +++ saveCra : set consultant err", error)
          this.isToRejectCra = false
          this.isToValidateCra = false
        }
      );
    } else {
      console.log("+++ saveCra : cat consultant of currentCra Not Null : ", this.currentCra.consultant)
      this.saveCraDirect(redirectToList, isSendNotification, title, message);
    }


  }

  /****
 * used to persist or update cra/conge
 */
  saveCraDirect(redirectToList: boolean, isSendNotification: boolean, title, message): void {

    console.log("saveCra ++++ saveCraDirect DEB this.currentCra, consultant : ", this.currentCra, this.currentCra.consultant)
    console.log("saveCra saveCraDirect isSendNotification=", isSendNotification)
    //////////////////////////

    if (this.typeCra == 'CONGE') {
      this.currentCra.type = 'CONGE';
    } else {
      this.currentCra.type = 'CRA';
    }

    if (!this.isCraValid(true) && this.currentCra.status != 'REJECTED') {
      console.log("saveCra saveCraDirect : isCraValid = KO !! this.currentCra=", this.currentCra)
      this.isToRejectCra = false
      this.isToValidateCra = false
      return;
    }

    console.log("saveCra ****************saveCraDirect this.currentCra=", this.currentCra)

    this.beforeCallServer("saveCraDirect")
    this.craService.save(this.currentCra).subscribe(
      data => {
        console.log("saveCraDirect", data)
        this.afterCallServer("saveCraDirect", data)

        this.currentCra = data.body.result
        this.statusHistoJsonToTab()
        this.dataSharingService.majConsultantInCra(this.currentCra,
          () => {
            console.log("+++ saveCra : change 05 of consultant of currentCra ", this.currentCra.consultant)
            console.log("+++ saveCra : currentCraUser.id ", this.currentCraUser.id)
            console.log("+++ saveCra : currentCra.consultant.id ", this.currentCra.consultant.id)
            console.log("+++ saveCra : currentCraUser.role ", this.currentCraUser.role)

            this.addToList(this.currentCra)

            console.log("saveCraDirect this.isError()=", this.isError())
            console.log("saveCraDirect isSendNotification=", isSendNotification)

            console.log("++++ saveCraDirect ap call server this.currentCra, consultant : ", this.currentCra, this.currentCra.consultant)

            if (!this.isError() && isSendNotification) this.sendNotification(title, message);
            if (!this.isError() && redirectToList) this.gotoCraList()
          }
        )

      }, error => {
        console.log("saveCraDirect error=", error)
        this.addErrorFromErrorOfServer("saveCraDirect", error);
      })

    /////////////////////////////////////

    console.log("++++ saveCraDirect FIN this.currentCra, consultant : ", this.currentCra, this.currentCra.consultant)

  }

  addToList(cra: Cra) {
    const list = this.dataSharingService.getListCra();
    if (cra && list) {
      const exists = list.some(item => item.id === cra.id);
      if (!exists) {
        list.push(cra);
        // Notifier les subscribers de la mise à jour
        this.dataSharingService.setListCra(list);
        // this.myList00 
        // this.setMyList(this.dataSharingService.listCra)
      }
    }
  }

  canDeleteCurrentCra() {
    let cond = !this.currentCra.validByConsultant && this.currentCra.id != null;

    if (this.dataSharingService.isCurrenUserRespOrAdmin()) {
      return this.currentCra.id != null;
    } else {
      return cond;
    }

  }

  canValidateCraOrConge() {

    // console.log("canValidateCraOrConge this.hasRoleManagerValidate()=",this.hasRoleManagerValidate())
    // console.log("canValidateCraOrConge this.currentCra.validByManager=", this.currentCra.validByManager)
    // console.log("canValidateCraOrConge this.isTimeToModify()=", this.isTimeToModify())
    // console.log("canValidateCraOrConge this.isCraOfManagerRole()=", this.isCraOfManagerRole())

    return this.hasRoleManagerValidate() && !this.currentCra.validByManager && this.isTimeToModify() && !this.isCraOfManagerRole();

  }


  sendNotification(title, message) {

    console.log("sendNotification this.currentCra=", this.currentCra)

    let isManager = this.hasRoleManagerValidate();
    let currentUser = this.userConnected;
    // let currentUser = this.currentCra.consultant
    console.log("sendNotification currentUser=", currentUser)
    console.log("sendNotification currentUser.role=", currentUser.role)

    console.log("sendNotification this.userConnected=", this.userConnected)
    console.log("sendNotification this.userConnected.role=", this.userConnected.role)

    if (!this.currentCra.consultant) {
      this.currentCra.consultant = currentUser
      console.log("+++ saveCra : change 06 of consultant of currentCra ", this.currentCra)
    }

    if (!currentUser.adminConsultant) {
      currentUser.adminConsultant = this.userConnected.adminConsultant
    }

    if (!currentUser.adminConsultant) {
      currentUser.adminConsultant = this.currentCra.manager
    }

    let notification: Notification = new Notification();

    notification.createdDate = new Date();
    notification.viewed = false;
    notification.title = title;
    notification.message = message;
    notification.cra = this.currentCra;
    notification.craId = this.currentCra.id;

    notification.fromUser = currentUser
    notification.fromUsername = notification.fromUser.username

    console.log("sendNotification fromUser : ", notification.fromUser)

    let toUser = currentUser.adminConsultant != null ? currentUser.adminConsultant : currentUser;
    console.log("sendNotification currentCra.status=", this.currentCra.status)
    if (this.currentCra.status != 'TO_VALIDATE') {
      toUser = this.currentCra.consultant
    }

    notification.toUser = toUser
    console.log("sendNotification toUser 1 : ", notification.toUser)

    console.log("sendNotification currentUser.role : ", currentUser.role)
    if (currentUser.role == "RESPONSIBLE_ESN") {
      notification.toUser = currentUser
    }

    console.log("sendNotification toUser 2 : ", notification.toUser)

    notification.toUsername = notification.toUser.username

    console.log("sendNotification isManager=", isManager)
    console.log("sendNotification currentUser=", currentUser)
    console.log("sendNotification currentCra.consultant=", this.currentCra.consultant)
    console.log("sendNotification currentCra.consultant.adminConsultant=", this.currentCra.consultant.adminConsultant)
    console.log("sendNotification notification=", notification)

    this.beforeCallServer("sendNotification")
    this.dataSharingService.addNotificationServer(notification).subscribe((data) => {
      this.afterCallServer("sendNotification", data)
      this.dataSharingService.getNotifications(null, null);

    }, error => {
      this.addErrorFromErrorOfServer("sendNotification", error);

    })

  }

  /****
   * used to remove current cra
   * @param myObj
   */
  delete(myObj: Cra) {
    console.log("delete this.currentCra=", this.currentCra)
    let mythis = this;
    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.craService.deleteById(myObj.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data)
              if (!mythis.isError()) {
                // mythis.findAll();
                mythis.currentCra = null;
                mythis.gotoCraList()
              }
            }, error => {
              mythis.addErrorFromErrorOfServer("delete", error);
              ////console.log(error);
            }
          );
      }
      , null
    );
  }

  onSelectActivity(activity: Activity) {
    this.craDayActivity.activity = activity;
  }

  @ViewChild('compoSelectActivity', { static: false }) compoSelectActivity: SelectComponent;
  selectActivity(activity: Activity) {
    this.compoSelectActivity.selectedObj = activity;
  }

  addActivity(craDayActivity: CraDayActivity, craDay: CraDay, isLanceProcess: boolean) {

    console.log("addActivity this.currentCra=", this.currentCra)

    console.log("addActivity craDayActivity=", craDayActivity)
    console.log("addActivity craDay=", craDay)
    console.log("addActivity isLanceProcess=", isLanceProcess)

    console.log("addActivity craDayActivity.activity=", craDayActivity.activity)

    ////console.log("saveActivity: this.craDay:", this.craDay)
    ////console.log("saveActivity: craDayActivity:", craDayActivity)
    ////console.log("saveActivity: isAddMultiDate:", this.isAddMultiDate)

    if (craDayActivity != null && craDayActivity.activity != null) {

      if (!craDay.craDayActivities) {
        craDay.craDayActivities = []
      }

      craDay.craDayActivities.push(craDayActivity);
      this.setEvent(craDay, craDayActivity);

      console.log("++++ addActivity OK craDayActivity=", craDayActivity)

      this.craService.setDayProps(craDay);

      if (isLanceProcess) {
        this.process();
      }
    }

  }

  /***
   * used to add new cra day activity
   */
  addCurrentActivity() {

    console.log("addCurrentActivity: deb craDayActivity:", this.craDayActivity)
    console.log("addCurrentActivity: deb isAddMultiDate:", this.isAddMultiDate)
    console.log("addCurrentActivity: isEditCraActivity:", this.isEditCraActivity)
    console.log("addCurrentActivity: craDay:", this.craDay)
    console.log("addCurrentActivity: currentCra:", this.currentCra)

    if (!this.isAddMultiDate) {
      if (this.craDayActivity != null && !this.isEditCraActivity) {

        ////////console.log("saveCurrentActivity: craDay:", this.craDay)

        this.addActivity(this.craDayActivity, this.craDay, true);

        this.craDayActivity = new CraDayActivity();
        this.refreshMe();
      }

      if (this.isEditCraActivity) {
        //this.craDayActivityCurrent
      }

      this.currentCra = this.craService.updateCraDay(this.currentCra, this.craDay);
      console.log(this.currentCra)
    } else {
      ////console.log("date deb" , this.addMultiDateStartDate)
      ////console.log("date fin" , this.addMultiDateEndDate)
      this.addActivityInDates(this.craDayActivity, this.addMultiDateStartDate, this.addMultiDateEndDate);
    }

    this.modal.dismissAll(this.dayDetailView);
  }

  getTitleButtonAddActivity() {
    let t = "Add Activity";
    if (this.isAddMultiDate) {
      t = "Add Activities";
    }
    return t;
  }

  addActivityInDates(craDayActivity: CraDayActivity, dateDeb: Date, dateFin: Date) {
    console.log("addActivityInDates DEB : craDayActivity, dateDeb, dateFin : ", craDayActivity, dateDeb, dateFin)

    let nbJoursDiff = this.utils.getNbJourBetweenDates(dateDeb, dateFin);
    console.log("addActivityInDates: nbJoursDiff", nbJoursDiff)

    for (let i = 0; i < nbJoursDiff + 1; i++) {
      let date = this.utils.getDatePlusNbJour(dateDeb, i);
      console.log("addActivityInDates: currentCra, date", this.currentCra, date)
      this.craDay = this.craService.getCraDayByDate(this.currentCra, date);
      console.log("addActivityInDates: craDay : ", this.craDay)
      // this.craService.setDayProps(this.craDay);
      console.log("addActivityInDates: craService, craDayActivity: ", this.craService, craDayActivity)
      if (this.craService.canAddActivity(this.craDay, craDayActivity)) {
        if (this.craService.isCraDayOpen(this.craDay)) {
          console.log("addActivityInDates: can add OK")
          let cda = this.getNewCraDayActivityFrom(craDayActivity);
          this.craDayActivity = cda;
          this.addActivity(this.craDayActivity, this.craDay, false);
        } else {
          console.log("addActivityInDates: can add KO : this.craDay, craDayActivity : ", this.craDay, craDayActivity)
        }
      }
    }
    this.process();
    this.refreshMe();

    console.log("********* addActivityInDates END : currentCra: ", this.currentCra)

  }

  /***
   * Used to change the type of hour worked => Normal day || Over time
   * @param value
   */
  onCheckTime(value: boolean) {
    if (value) {
      this.craDayActivity.isOverTime = true
      this.craDayActivity.nbDay = 0;
    } else {
      this.craDayActivity.isOverTime = false
      this.craDayActivity.startHour = null;
      this.craDayActivity.endHour = null;
    }
  }

  onSelectTime(time: number) {
    this.craDayActivity.nbDay = time;
  }

  @ViewChild('compoSelectTime', { static: false }) compoSelectTime: SelectComponent;
  selectTime(time: number) {
    this.compoSelectTime.selectedObj = time;
  }

  getIndexOfTime(nbDay: number): number {
    let index = -1;
    for (let i = 0; i < this.times.length; i++) {
      if (this.craDayActivity.nbDay == this.times[i]) {
        index = i
        break;
      }
    }
    return index;
  }

  ////////////

  isTimeToModify(): boolean {
    this.setMonthCurentCraIfNull();
    let dateCra = this.utils.getDate(this.currentCra.month);
    let moisPrec = this.utils.getDateLastMonthFirstDay();

    // console.log("isTimeToModify : dateCra:", dateCra)
    // console.log("isTimeToModify : moisPrec:", moisPrec)
    // console.log("isTimeToModify : dateCra >= moisPrec:", (dateCra >= moisPrec))

    return dateCra >= moisPrec;

  }


  /////////
  /**
   * 
   * @param isSilent : if true, then no alert info dialog if return true.
   * @returns 
   */
  isCraValid(isSilent: boolean): boolean {

    console.log("isCraValid DEB this.currentCra=", this.currentCra)


    if (this.currentCra.type == 'CONGE') {

      let isCongesVide = true;
      let today = new Date();
      let yesterday = this.utils.getDateYesterday();

      for (let i = 0; i < this.currentCra.craDays.length; i++) {
        let craDay: CraDay = this.currentCra.craDays[i];
        let craDayActivities: CraDayActivity[] = craDay.craDayActivities;

        for (let craDayActivity of craDayActivities) {
          if ( craDayActivity.activity.type && !craDayActivity.activity.type.congeDay) {
            this.utilsIhm.info("isCraValid : Oops,verify your Conges plz. All days must be conge type.", null, null);
            this.currentCra.validByConsultant = null;
            this.currentCra.dateValidationConsultant = null;
            return false;
          } else {
            isCongesVide = false;
            let dateActivity: Date = this.utils.getDate(craDay.day);
            console.log("+++++ dateActivity", dateActivity)
            console.log("+++++ yesterday", yesterday)
            if (dateActivity <= yesterday) {
              this.utilsIhm.info("isCraValid : isCraValid : Oops, verify your Conges plz. We cant have a conge in the past.", null, null);
              return false;
            }
          }
        }

      }

      if (isCongesVide) {
        this.utilsIhm.info("isCraValid : Oops, Vous devez saisir au moins un conge.", null, null);
        this.currentCra.validByConsultant = null;
        this.currentCra.dateValidationConsultant = null;
        return false;
      }

      if (!isSilent) {
        this.utilsIhm.info("isCraValid : Votre demande de conge est VALIDE.\n Vous pouvez le soumettre a votre Manager.", null, null);
      }

    } else {
      for (let i = 0; i < this.currentCra.craDays.length; i++) {
        let craDay: CraDay = this.currentCra.craDays[i];
        if (craDay.type == "DAY_WORKED") {
          let craDayActivities: CraDayActivity[] = craDay.craDayActivities;
          let time: number = 0;
          craDayActivities.forEach(craDayActivity => {
            time = time + craDayActivity.nbDay;
          })
          if (time < 1) {
            // alert("Oops,verify your cra plz.All days you have been equals a 1.");
            this.utilsIhm.info("isCraValid : Oops,verify your cra plz.All days you have been equals a 1.", null, null);
            this.currentCra.validByConsultant = null;
            this.currentCra.dateValidationConsultant = null;
            return false;
          }
        }

      }

      if (!isSilent) {
        this.utilsIhm.info("isCraValid : Votre CRA est VALIDE.\n Vous pouvez le soumettre a votre Manager.", null, null);
      }
    }

    console.log("isCraValid END OK this.currentCra=", this.currentCra)

    return true;
  }

  getNameByType() {
    let name = this.utils.tr("Cra");
    if (this.currentCra && this.currentCra.type == 'CONGE') {
      name = this.utils.tr('Conge')
    }
    return name;
  }

  getLabelByType() {
    let name = "Cra";
    if (this.typeCra && this.typeCra == 'CONGE') {
      name = 'Conge'
    }
    return name;
  }

  /***
   * THis method aims to valid cra for manager
   */
  validCra() {

    this.isToValidateCra = true

    let name = this.getNameByType();

    this.utilsIhm.confirmYesNo("Voulez-vous valider le " + name + "?", this
      , () => {
        this.currentCra.validByManager = true;
        this.currentCra.dateValidationManager = new Date();
        this.setStatus("VALIDATED")
        this.saveCra(true, true, name + " validated by Manager", this.currentCra.comment);
      },
      () => {
        this.currentCra.validByManager = false;
        this.currentCra.dateValidationManager = null;
      }
    );

  }

  /***
 * This method used to rejected cra,
 */
  rejectCra() {
    console.log("rejectCra DEB currentCra", this.currentCra)
    this.isToRejectCra = true
    let name = this.getNameByType();
    this.currentCraUser = this.currentCra.consultant

    this.currentCra.validByManager = false;
    this.currentCra.validByConsultant = false;
    this.setStatus("REJECTED")
    this.modal.dismissAll(this.rejectCraView);
    this.saveCra(true, true, name + " rejected", this.currentCra.comment);
    console.log("rejectCra END currentCra", this.currentCra)

  }

  // soumettre cra 
  sendCraToValidate() {
    console.log("sendCraToValidate DEB currentCra", this.currentCra)

    if (this.currentCra == null) {
      console.log("sendCraToValidate ERROR : currentCra is NULL !! ")
      return
    }

    // let currentUser: Consultant = this.dataSharingService.userConnected
    // let currentUser: Consultant = this.currentCra.consultant
    let currentUser: Consultant = this.userConnected
    this.currentCra.consultant = currentUser
    this.currentCraUser = this.currentCra.consultant

    let craUser = this.currentCra.consultant
    let craManager = this.currentCra.consultant?.adminConsultant

    if (craUser.role == "RESPONSIBLE_ESN") {
      craManager = craUser;
    }

    console.log("sendCraToValidate currentUser, craUser, craManager : ", currentUser, craUser, craManager)

    if (craUser != null) {

      let name = this.getNameByType();

      if (this.isCraValid(true)) {

        this.utilsIhm.confirmYesNo("\n" +
          "Voulez-vous soumettre le " + name + "?\n" +
          "Une fois soumis, impossible de le modifier", this
          , () => {
            console.log("sendCraToValidate go to soumettre cra : currentUser.adminConsultant ", currentUser.adminConsultant)
            this.currentCra.validByConsultant = true;
            this.currentCra.dateValidationConsultant = new Date();
            this.currentCra.comment = null;
            this.setStatus("TO_VALIDATE")
            // this.saveCra(false, false, "", "");
            if (craManager != null) {
              // this.currentCra.consultant.adminConsultant = currentUser.adminConsultant;
              this.saveCra(true, true, name + " to validate", "");
            }
          }
          , () => {
            this.currentCra.validByConsultant = false;
            this.currentCra.dateValidationConsultant = null;
            this.setStatus("DRAFT")
          });
      }

    } else {
      this.utilsIhm.info("currentUser is NULL", null, null);
    }
  }

  /****
   * used to set new event in the events data
   * @param craActivity
   */
  private setEvent(craDay: CraDay, craActivity: CraDayActivity, isRefresh = true): void {

    // console.log("setEvent this.currentCra=", this.currentCra)

    if (craActivity.activity != null) {
      let title = UtilsService.getEventTitle(craActivity);
      let day = this.utils.getDate(craDay.day);
      title = title.slice(0, 25);

      let color = colors.blue;
      let cssClass = 'event';

      this.events.push({
        title: title,
        start: startOfDay(day),
        end: endOfDay(day),
        color,
        cssClass,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        meta: craActivity
      })
      if (isRefresh) {
        this.refreshMe();
      }
    }
  }

  deleteAllEvents() {

    console.log("deleteAllEvents this.currentCra=", this.currentCra)

    if (this.events && this.events.length > 0) {
      this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer tous les " + this.events.length + " evenements", this
        , () => {
          this.events = [];
          this.currentCra.craDays.forEach((v, k) => {
            v.craDayActivities = [];
          })

          this.refreshMe()
        }
        , null
      );
    } else {
      this.utilsIhm.info("Aucun evenement a effacer !", this, null);
    }

  }

  /***
   * This method aims to calc the days abs/ days worked
   */
  private process(): void {
    console.log("******* process deb")
    // console.log("******* process currentCra:", this.currentCra)

    this.numberDayWorked = 0;
    this.numberDayAbs = 0;
    this.numberDayBilled = 0;
    this.totalBilled = 0;
    this.totalDayToWork = 0;
    if (this.currentCra != null && this.currentCra.craDays != null) {
      this.currentCra.craDays.forEach((craDay, index) => {
        if (this.craService.isCraDayOpen(craDay)) {
          this.totalDayToWork++;
        }
        craDay.craDayActivities.forEach((cda, k) => {
          let activity: Activity = cda.activity;
          // ////////console.log("******* process activity:", activity)

          let type: ActivityType = activity.type;
          if (type == null) {
            this.activityTypeService.findById(activity.typeId).subscribe(
              data => {
                activity.type = data.body.result;
                type = activity.type;

                this.calcul_recap(activity, cda, craDay);
              },
              error => {
                console.log("ERROR activityTypeService.findById, activity.typeId, err", activity.typeId, error)
              }
            );
          } else {
            this.calcul_recap(activity, cda, craDay);
          }

        });
      });
    }
    console.log("******* process fin this.totalDayToWork=" + this.totalDayToWork)
  }

  private calcul_recap(activity: Activity, cda: CraDayActivity, craDay: CraDay) {
    if (activity && activity.type.workDay) this.numberDayWorked += cda.nbDay;
    if (activity && activity.type.billDay) {
      this.numberDayBilled += cda.nbDay;
      this.totalBilled += cda.nbDay * activity.tjm;
    }
    if (this.craService.isCraDayOpen(craDay) && activity && activity.type.congeDay) this.numberDayAbs += cda.nbDay;
  }

  /***
   * This method used to get times
   */
  getTimes() {
    if (this.isEditCraActivity) {
      return this.times;
    } else {
      let craDayActivities: CraDayActivity[] = this.craDay.craDayActivities;
      if (craDayActivities.length > 0) {
        let time: number = 0;
        craDayActivities.forEach(value => {
          time += value.nbDay;
        })
        if (time == 0) return this.times;
        if (time == 0.5) return [0.5]
        if (time == 1) return [];
      }
    }

    return this.times;
  }

  /***
   * used to verify current user has role to validate manager cra
   */
  hasRoleManagerValidate() {
    let currentUser = this.dataSharingService.userConnected
    let isCurUserRespOrAdmin = this.dataSharingService.isCurrenUserRespOrAdmin()
    if (this.isAdd || (this.isCurrenUserSameAsUserOfCurrentCra() && !isCurUserRespOrAdmin)) return false;
    if (currentUser.role == "MANAGER" || isCurUserRespOrAdmin) return true;
    return false;
  }

  isCurrenUserSameAsUserOfCurrentCra() {
    return this.dataSharingService.userConnected.id == this.currentCra?.consultant?.id
  }

  hasManager() {
    let currentUser = this.dataSharingService.userConnected
    // return (currentUser.role != "RESPONSIBLE_ESN" && currentUser.role != "ADMIN");
    return (currentUser.role != "ADMIN");
  }

  isCraOfManagerRole() {
    let currentUser = this.dataSharingService.userConnected

    if (this.isCurrenUserSameAsUserOfCurrentCra() && currentUser.role == "MANAGER") return true;
    return false;
  }

  /****
   * This method invoked when i need to show the modal rejected cra
   */
  openModalPopup(templateRef: TemplateRef<any>) {
    this.modal.open(templateRef, { size: 'lg' });
  }

  /***
   *This method invoked when the state of cra observable changed, used to set update current cra
   * @param observable
   */
  update(observable: CraObservable): void {
    let addMultiDateComponent: AddMultiDateComponent = <AddMultiDateComponent>observable;
    this.currentCra = addMultiDateComponent.currentCra;

    this.initCra(this.currentCra);
    this.process();
    this.refreshMe();
  }


  /**
   // avoir la liste des clients du cra courant 
   // si un seul client, on genere le cra client de celui-ci
   // si plusieurs : on ouvre une popup avec liste des btn / client 
     * 
     */
  generateCliPDFGenLinks() {
    let label = "generateCliPDFGenLinks"
    this.beforeCallServer(label);

    let userName = this.currentCra.consultant.fullName.replace(" ", "-");
    let now = this.utils.getDateNow()

    console.log(label + " : ", now)

    // retourne an array of clientName 
    this.craService.getClientsOfCra(this.currentCra.id)
      .subscribe(
        response => {
          console.log(label + " response : ", response)
          this.afterCallServer(label, response)
          let clients = response.body.result
          console.log(label + " >>> AV ouverture dialog avec clients=", clients);
          if (clients) {
            if (clients.length == 1) {
              let clientName = clients[0].name
              console.log(label + " : one client : ", clientName)
              this.craService.generateCliPDFClientName(this.currentCra.id, clientName).subscribe(
                response => {
                  this.afterCallServer(label, response)
                  console.log(label, "response : ", response)
                  const linkSource = `data:application/pdf;base64,${response.body.result}`;
                  const downloadLink = document.createElement("a");
                  const fileName = "cra-cli-" + userName + "-" + clientName + "-" + now + ".pdf";
                  downloadLink.href = linkSource;
                  downloadLink.download = fileName;
                  downloadLink.click();
                }, error => {
                  this.addErrorFromErrorOfServer(label, error);
                  ////console.log(error);
                }
              );
            } else {
              //>1
              // TODO on ouvre une popup avec liste des btn / client 
              console.log(">>> AV ouverture dialog avec clients=", clients);
              this.openClientsDialog(clients);
            }
          } else {
            console.log(label + " : NO client ")
          }


        }, error => {
          console.log("ERROR : ", error)
          this.addErrorFromErrorOfServer(label, error);
        }
      );
  }

  // ouverture du dialog
  openClientsDialog(clients: any[]) {
    console.log(">>> ouverture dialog avec clients=", clients);

    const dialogRef = this.dialog.open(ClientsDialogComponent, {
      width: '400px',
      data: { clients: clients }
    });

    let label = "openClientsDialog"
    this.beforeCallServer(label);

    let userName = this.currentCra.consultant.fullName.replace(" ", "-");
    let now = this.utils.getDateNow()

    dialogRef.afterClosed().subscribe(selectedClient => {
      console.log("selectedClient : ", selectedClient)
      if (selectedClient) {
        this.craService.generateCliPDFClientName(this.currentCra.id, selectedClient.name).subscribe(
          response => {
            this.afterCallServer(label, response)
            console.log(label, "response : ", response)
            const linkSource = `data:application/pdf;base64,${response.body.result}`;
            const downloadLink = document.createElement("a");
            const fileName = "cra-cli-" + userName + "-" + now + ".pdf";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          }, error => {
            this.addErrorFromErrorOfServer(label, error);
            ////console.log(error);
          }
        );
      }
    });
  }

  generateEsnPDF() {
    let label = "generateEsnPDF"
    this.beforeCallServer(label);

    let userName = this.currentCra.consultant.fullName.replace(" ", "-");
    let now = this.utils.getDateNow()

    this.craService.generateEsnPDF(this.currentCra.id)
      .subscribe(
        response => {
          this.afterCallServer(label, response)
          console.log(label, "response : ", response)
          const linkSource = `data:application/pdf;base64,${response.body.result}`;
          const downloadLink = document.createElement("a");
          const fileName = "cra-esn-" + userName + "-" + now + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }, error => {
          this.addErrorFromErrorOfServer(label, error);
          ////console.log(error);
        }
      );

  }


  downloadPDF(craReportActivity: CraReportActivity) {
    const linkSource = `data:application/pdf;base64,${craReportActivity.pdfData}`;
    const downloadLink = document.createElement("a");
    this.setMonthCurentCraIfNull();
    const fileName = this.currentCra.consultant?.username.split("@")[0] + "_" + craReportActivity.activity.replace(" ", "_").toLowerCase() + "_" + this.currentCra.month + ".pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      const ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      if (["pdf", "png", "jpg"].includes(ext)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.currentCra.attachment = reader.result
        }
      } else {
        // alert("Oops, seuls les fichiers en format [pdf,png,jpg] sont acceptés.")
        this.utilsIhm.info("Oops, seuls les fichiers en format [pdf,png,jpg] sont acceptés.", null, null);
        this.attachment.nativeElement.value = "";
      }

    }
  }

  downloadAttachment() {
    let attachment: string = this.currentCra.attachment.toString();
    const linkSource = attachment;
    const extension = attachment.substring("data:".length, attachment.indexOf(";base64"))
    const downloadLink = document.createElement("a");
    let fileName = "" + new Date().getTime();
    if (extension == "jpeg") {
      fileName.concat(".jpg")
    } else if (extension == "png") {
      fileName.concat(".png")
    } else {
      fileName.concat(".pdf")
    }
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  refreshMe() {
    console.log("**** refreshMe deb this.viewDate : ", this.viewDate)

    setTimeout(() => {
      if (this.notADate(this.viewDate)) this.viewDate = new Date();
      this.viewDate = this.utils.getDate(this.viewDate);
      console.log("**** refreshMe av refresh : ", this.viewDate)
      try {
        this.refresh.next(0)
        console.log("**** refreshMe ap refresh : ", this.viewDate)
      } catch (error) {
        console.log("refreshMe error:", error)
      }
      console.log("**** refreshMe fin")
    }, 500);
  }

  setStatus(status: string) {
    this.currentCra.status = status
    this.addStatusHisto()
  }

  showHistoryStatus() {
    const dialogRef = this.dialog.open(CraHistoStatusComponent, {
      width: '800px',
      data: { myList: this.currentCra.statusHistoTab }
    });

  }

}
