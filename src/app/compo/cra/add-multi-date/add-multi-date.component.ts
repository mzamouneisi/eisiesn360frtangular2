import { DatePipe } from "@angular/common";
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CraObservable, CraObserver } from "../../../core/core";
import { Activity } from "../../../model/activity";
import { Cra } from "../../../model/cra";
import { CraDayActivity } from "../../../model/cra-day-activity";
import { MultiDateActivity } from "../../../model/multi-date-activity";
import { ActivityService } from "../../../service/activity.service";
import { DataSharingService } from "../../../service/data-sharing.service";
import { UtilsService } from "../../../service/utils.service";
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';
import { MzDatePickerDebFinComponent } from '../../mz-date-picker-deb-fin/mz-date-picker-deb-fin.component';
import { CraFormCalComponent } from "../cra-form/cra-form-cal.component";

@Component({
  selector: 'app-add-multi-date',
  templateUrl: './add-multi-date.component.html',
  styleUrls: ['./add-multi-date.component.css']
})
export class AddMultiDateComponent extends MereComponent implements CraObservable {

  activityForm: FormGroup;
  activityControl: FormControl;
  activities: Activity[];
  timesForm: FormGroup;
  timesControl: FormControl;
  @ViewChild('addRangeDateView', {static: true}) addRangeDateView: TemplateRef<any>;
  @ViewChild('myDatePickerDebFin', {static: false}) myDatePickerDebFin: MzDatePickerDebFinComponent;

  times: number[] = [0.5, 1]

  myObj: MultiDateActivity = new MultiDateActivity();
  data: MultiDateActivity[] = new Array();
  observers: Array<CraObserver> = new Array();
  @Input() currentCra: Cra;

  constructor(private activityService: ActivityService
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
    , private datePipe: DatePipe
    , private modal: NgbModal
  ) {
    super(utils, dataSharingService);

    this.timesForm = new FormGroup({
      timesControl: new FormControl()
    });

    this.activityForm = new FormGroup({
      activityControl: new FormControl()
    });
  }


  ngOnInit() {
    this.beforeCallServer("ngOnInit")
    this.activityService.findAll().subscribe(
      data => {
        this.afterCallServer("ngOnInit", data)
        this.activities = data.body.result;
        if (data == null) {
          this.activities = new Array();
        }
      }, error => {
        this.addErrorFromErrorOfServer("ngOnInit", error);
      }
    );
    // let craFormCalComponent: CraFormCalComponent = CraFormCalComponent.getInstance();
    let craFormCalComponent: CraFormCalComponent = this.dataSharingService.getService(CraFormCalComponent.name)
    this.subscribe(craFormCalComponent)

    if(this.myObj && this.currentCra) {
      this.myObj.startDate = this.currentCra.month;
    }
    
  }

  onSelectActivity(activity: Activity) {
    this.myObj.activity = activity;
  }

  @ViewChild('compoSelectActivity', {static:false}) compoSelectActivity:SelectComponent ;
  selectActivity(activity:Activity){
      this.compoSelectActivity.selectedObj = activity;
  }


  onSelectTime(time: number) {
    this.myObj.time = time;
  }

  @ViewChild('compoSelectTime', {static:false}) compoSelectTime:SelectComponent ;
  selectTime(time:number){
      this.compoSelectTime.selectedObj = time;
  }

  errorDates = "";
  onStartDateInputChanged(date: Date, error: string) {
    this.myObj.startDate=date;
    this.errorDates=error;
    ////////////console.log("main onChangeDateDeb myDatePickerDeb", date, error);
    if(this.errorDates) {
      this.utils.showNotification("error", "The end date of project you have been above of the start date !")
    }
  }

  onEndDateInputChanged(date: Date, error: string) {
    this.myObj.endDate=new Date(date.getTime() + 24*60*60*1000);  //debug du fin-1
    this.errorDates=error;
    ////////////console.log("main onChangeDateDeb myDatePickerDeb", date, error);
    if(this.errorDates) {
      this.utils.showNotification("error", "The end date of project you have been above of the start date !")
    }
  }

  /***
   * Invoked to add new item
   */
  push() {
    this.data.push(this.myObj);
    this.data.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    this.myObj = new MultiDateActivity();
    this.activityForm.reset();
    this.timesForm.reset();
    if(this.myDatePickerDebFin)     this.myDatePickerDebFin.reset();
    else {
      ////////console.log("cant reset because: myDatePickerDebFin IS NULL")
    }
  }

  /***
   * invoked to remove item form data objects
   * @param index
   */
  removeItem(index: number) {
    this.data.splice(index, 1)
  }

  /***
   * This method used to test if current date eligible to added or no
   * @param date
   */
  isBetweenTowDate(date: Date): boolean {
    let state: boolean = false;
    let time: number = 0;
    this.data.forEach((value, index) => {
      if (value.startDate.getTime() <= date.getTime() && date.getTime() <= value.endDate.getTime()) {
        time = time + value.time;
      }
    })
    if (time + this.myObj.time > 1) {
      state = true;
    }
    return state;
  }

  /***
   * This method used to test if current date eligible to added or no
   * @param date
   */
  isBetweenActivity(date: Date): boolean {
    let state: boolean = false;
    let currentActivity: Activity = this.myObj.activity;
    if (currentActivity != null) {
      if (currentActivity.type.name == "MISSION") {
        let startDate: string = this.datePipe.transform(currentActivity.dateDeb, 'yyyy-MM-dd');
        let endDate: string = this.datePipe.transform(currentActivity.dateFin, 'yyyy-MM-dd');
        // //////////console.log("DBG isBetweenActivity : currentActivity: ", currentActivity)
        if (new Date(startDate).getTime() <= date.getTime()
          && date.getTime() <= new Date(endDate).getTime()) {
          state = true;
        }
        if (!state) {
          this.utils.showNotification("error", "Oops,this date is out of interval activity selected [" + startDate + "," + endDate + "]")
        }
      } else {
        state = true;
      }
    }

    return state;

  }


  /***
   * invoked to add observer to listener of cra observable
   * @param observer
   */
  subscribe(observer: CraObserver): void {
    this.observers.push(observer);
  }

  /***
   * invoked to remove observer form the listener of cra observable
   * @param observer
   */
  unsubscribe(observer: CraObserver): void {
    let index: number = this.observers.indexOf(observer);
    this.observers.splice(index, 1);
  }

  /***
   * Used to notify all observer
   */
  notifyObservers(): void {
    this.observers.forEach(observer => observer.update(this));
  }

  /**
   * invoked when you need to refresh current cra from the range dates added
   */
  update(): void {
    this.data.forEach((value) => {
      this.currentCra.craDays
        .filter(craDay => {
          return new Date(this.datePipe.transform(craDay.day, 'yyyy-MM-dd')).getTime() <= value.endDate.getTime() &&
            new Date(this.datePipe.transform(craDay.day, 'yyyy-MM-dd')).getTime() >= value.startDate.getTime()
        })
        .forEach(craDy => {
          if (craDy.type == "DAY_WORKED") {
            let tmp: CraDayActivity = new CraDayActivity();
            tmp.activity = value.activity;
            tmp.nbDay = value.time;
            let nbDay: number = 0;
            craDy.craDayActivities.forEach(item => {
              nbDay = nbDay + item.nbDay;
            })
            if (nbDay + value.time <= 1) {
              craDy.craDayActivities.push(tmp);
            } else {
              craDy.craDayActivities = [];
              craDy.craDayActivities.push(tmp);
            }
          }
        })
    });
    this.data = new Array();
    this.modal.dismissAll(this.addRangeDateView);
    this.notifyObservers();
  }


}
