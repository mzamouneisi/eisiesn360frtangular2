import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-mz-date-picker',
  templateUrl: './mz-date-picker.component.html',
  styleUrls: ['./mz-date-picker.component.css']
})
export class MzDatePickerComponent implements OnInit {

  @Input() placeHolder : string = '';
  @Input() myDatePicker:Date=new Date();
  @Output() myDatePickerChange:EventEmitter<Date> =new EventEmitter<Date>(); 
  picker:any;
  @Input() objCaller!: any; 
  @Input() onChangeCaller!: string; 
  @Input() dateInputId: string;

  constructor(private dateAdapter: DateAdapter<Date>) {
    //  this.dateAdapter.setLocale('en-GB'); // dd/MM/yyyy
      this.dateAdapter.setLocale('fr-FR'); // dd/MM/yyyy
    }
  ngOnInit(): void {
    this.myDatePicker=new Date(this.myDatePicker);
  }

  onUpdateDate(ev:any) {
    // //////////console.log("onUpdateDate", ev);
    this.myDatePickerChange.emit(this.myDatePicker);
    if(this.objCaller && this.onChangeCaller) this.objCaller[this.onChangeCaller](this.myDatePicker);
  }

}
