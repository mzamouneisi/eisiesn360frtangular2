import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-mz-date-picker-deb-fin',
  templateUrl: './mz-date-picker-deb-fin.component.html',
  styleUrls: ['./mz-date-picker-deb-fin.component.css']
})
export class MzDatePickerDebFinComponent implements OnInit {

  ERR_DATES = "date fin doit etre plus grande ou egale a debut.";
  error = "";

  @Input() placeHolderDeb: string = '';
  @Input() placeHolderFin: string = '';

  @Input() myDatePickerDeb!: Date;
  @Input() myDatePickerFin!: Date;

  @Input() objCaller!: any;

  @Input() onChangeCallerDeb!: string;
  @Input() onChangeCallerFin!: string;

  @Output() myDatePickerChangeDeb: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() myDatePickerChangeFin: EventEmitter<Date> = new EventEmitter<Date>();

  @ViewChild('dateRangeStart', { static: true }) dateRangeStart: HTMLInputElement;
  @ViewChild('dateRangeEnd', { static: true }) dateRangeEnd: HTMLInputElement;

  myForm: FormGroup;

  constructor(private dateAdapter: DateAdapter<Date>, private formBuilder: FormBuilder) {
    //  this.dateAdapter.setLocale('en-GB'); // dd/MM/yyyy
    this.dateAdapter.setLocale('fr-FR'); // dd/MM/yyyy

    this.myForm = this.formBuilder.group({
      myDateRange: this.formBuilder.group({
        startDate: this.myDatePickerDeb || new Date(),
        endDate: this.myDatePickerFin || new Date()
      })
    });
  }

  ngOnInit(): void {

    if (!this.myDatePickerDeb) this.myDatePickerDeb = new Date();
    if (!this.myDatePickerFin) this.myDatePickerFin = new Date();

    console.log("ngOnInit : myDatePickerDeb ", this.myDatePickerDeb)
    console.log("ngOnInit : myDatePickerFin ", this.myDatePickerFin)

    this.myForm.get('myDateRange').get('startDate').setValue(this.myDatePickerDeb)
    this.myForm.get('myDateRange').get('endDate').setValue(this.myDatePickerFin)

    console.log("app-mz-date-picker-deb-fin' ngOnit myDatePickerDeb : ", this.myDatePickerDeb)
    console.log("app-mz-date-picker-deb-fin' ngOnit this.myForm.get('myDateRange').get('startDate').value : ", this.myForm.get('myDateRange').get('startDate').value)

  }

  get myDateRange() {
    return this.myForm.get('myDateRange');
  }

  initToZeroHoursMinSecMilSec(d1: Date): Date {
    if (!d1) return null;
    if (typeof d1 == "string") d1 = new Date(d1);
    d1.setHours(0);
    d1.setMinutes(0);
    d1.setSeconds(0);
    d1.setMilliseconds(0);
    return d1;
  }

  compareDates(d1: Date, d2: Date): number {
    if (!d1) return -1;
    if (!d2) return 1;
    d1 = this.initToZeroHoursMinSecMilSec(d1);
    d2 = this.initToZeroHoursMinSecMilSec(d2);

    return d1.getTime() - d2.getTime();
  }

  isDateFinBigger(): boolean {
    console.log("isDateFinBigger : myDatePickerFin, myDatePickerDeb : ", this.myDatePickerFin, this.myDatePickerDeb)
    return this.compareDates(this.myDatePickerFin, this.myDatePickerDeb) >= 0;
  }

  getDate(d: any) {
    if (!d) return null;
    if (typeof d == "string") {
      let tab = d.split("/")
      if (tab && tab.length >= 3) {
        let y = parseInt(tab[2])
        let m = parseInt(tab[1]);
        m = m - 1;
        let day = parseInt(tab[0])
        d = new Date(y, m, day);
      }
    }
    return d;
  }

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    console.log("dateRangeChange: dateRangeStart, dateRangeEnd : ", dateRangeStart, dateRangeEnd)

    this.myDatePickerDeb = this.getDate(dateRangeStart.value);
    this.myDatePickerFin = this.getDate(dateRangeEnd.value);

    ////////console.log("dateRangeChange:", this.myDatePickerDeb, this.myDatePickerFin)


    if (this.objCaller && this.onChangeCallerDeb) this.objCaller[this.onChangeCallerDeb](this.myDatePickerDeb, this.error);
    if (this.objCaller && this.onChangeCallerFin) this.objCaller[this.onChangeCallerFin](this.myDatePickerFin, this.error);
  }


  onFormSubmit() {

    console.log("onFormSubmit this.myDatePickerDeb:", this.myDatePickerDeb)
    console.log("onFormSubmit this.myDatePickerFin:", this.myDatePickerFin)

  }

  public reset() {

    console.log("reset this.dateRangeStart:", this.dateRangeStart)
    console.log("reset this.dateRangeEnd:", this.dateRangeEnd)

    this.dateRangeStart.value = '';
    this.dateRangeEnd.value = '';
  }

}
