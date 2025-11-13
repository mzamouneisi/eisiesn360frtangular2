import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarView } from "angular-calendar";
import { MonthViewDay } from "calendar-utils";
import { endOfDay, startOfDay } from "date-fns";
import { Subject } from "rxjs";
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { CraConfiguration } from "../../../model/cra-configuration";
import { CraConfigurationService } from "../../../service/cra-configuration.service";
import { UtilsService } from "../../../service/utils.service";
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-cra-configuration',
  templateUrl: './cra-configuration.component.html',
  styleUrls: ['./cra-configuration.component.css']
})
export class CraConfigurationComponent extends MereComponent {

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = new Array();
  refresh: Subject<any> = new Subject();
  holiday: string = "holiday";
  craConfigurationData: CraConfiguration = new CraConfiguration();

  @ViewChild('customCellTemplate', {static: true}) customCellTemplate: TemplateRef<any>;

  constructor(private craConfigurationService: CraConfigurationService     , public utils: UtilsService
    , public dataSharingService: DataSharingService, private datePipe: DatePipe) {
      super(utils, dataSharingService);
  }

  ngOnInit() {
    this.viewDateChange()

  }

  viewDateChange() {
    this.beforeCallServer("viewDateChange")
    this.craConfigurationService.getCraConfigByMonth(this.datePipe.transform(this.viewDate, "MM-yyyy"))
      .subscribe((data) => {
        this.afterCallServer("viewDateChange", data)
        this.craConfigurationData = data.body.result
        this.setEvents()
      }, error => {
        this.addErrorFromErrorOfServer("viewDateChange", error);
      })
  }


  update() {
    this.beforeCallServer("update")
    console.log("update craConfigurationData : ", this.craConfigurationData)
    this.craConfigurationService.updateCraConfiguration(this.craConfigurationData).subscribe((data) => {
      this.afterCallServer("update", data)
      this.craConfigurationData = data.body.result
      console.log("craConfigurationData : ", this.craConfigurationData)
    }, (error) => {
      this.addErrorFromErrorOfServer("update", error);
    })
  }

  dayClicked(day: MonthViewDay<any>, events: CalendarEvent[]) {
    if (this.craConfigurationData.holidays != null) {
      let index = this.craConfigurationData.holidays.findIndex(item => this.datePipe.transform(item, "dd-MM-yyyy") ==
        this.datePipe.transform(day.date, "dd-MM-yyyy"));
      if (index > -1) {
        this.craConfigurationData.holidays.splice(index, 1)
      } else {
        this.craConfigurationData.holidays.push(day.date);
      }
    } else {
      this.craConfigurationData.holidays=new Array();
      this.craConfigurationData.holidays.push(day.date);
    }

    this.setEvents();
    this.update();
  }

  private setEvents() {
    this.events = [];
    this.craConfigurationData.holidays.forEach(value => {
      value = this.utils.getDate(value);
      this.events.push({
        title: "title",
        start: startOfDay(value),
        end: endOfDay(value),
        color: {
          primary: '#1e90ff',
          secondary: '#D1E8FF'
        },
        cssClass: 'event',
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      })
    })
    this.refreshMe();
  }

  refreshMe() {
    this.refresh.next(0);
  }

}
