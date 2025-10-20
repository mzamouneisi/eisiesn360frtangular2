import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { FraisPerDateDashboard } from 'src/app/model/fraisPerDateDashboard';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { NoteFraisDashboardService } from 'src/app/service/note-frais-dashboard.service';
import { UtilsService } from 'src/app/service/utils.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-fee-depense-peryear-dash',
  templateUrl: './fee-depense-peryear-dash.component.html',
  styleUrls: ['./fee-depense-peryear-dash.component.css']
})
export class FeeDepensePeryearDashComponent extends MereComponent {
  highcharts = Highcharts;
  chartOptions: any
  fraisPerYear: FraisPerDateDashboard[];
  error: any;
  list1: Array<any>=[];
  list2: Array<any>=[];
  list3: Array<any>=[];
  list4: Array<any>=[];
  list5: Array<any>=[];

  constructor(
    private noteFraisDashboardService: NoteFraisDashboardService,
    public utils: UtilsService,
    public dataSharingService: DataSharingService
    
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit(): void {
    this.getDepensesPerYear();
  }
  
  getDepensesPerYear(){
    this.noteFraisDashboardService.getAllFraisPerYearDashboard().subscribe(
      data => {
        this.fraisPerYear = data.body.result;
        if(this.fraisPerYear.length >= 5){
          this.list1 = [this.fraisPerYear[this.fraisPerYear.length-5].date, this.fraisPerYear[this.fraisPerYear.length-5].sumfrais];
          this.list2 = [this.fraisPerYear[this.fraisPerYear.length-4].date, this.fraisPerYear[this.fraisPerYear.length-4].sumfrais];
          this.list3 = [this.fraisPerYear[this.fraisPerYear.length-3].date, this.fraisPerYear[this.fraisPerYear.length-3].sumfrais];
          this.list4 = [this.fraisPerYear[this.fraisPerYear.length-2].date, this.fraisPerYear[this.fraisPerYear.length-2].sumfrais];
          this.list5 = [this.fraisPerYear[this.fraisPerYear.length-1].date, this.fraisPerYear[this.fraisPerYear.length-1].sumfrais];
        }
        else if(this.fraisPerYear.length == 4){
          this.list2 = [this.fraisPerYear[this.fraisPerYear.length-4].date, this.fraisPerYear[this.fraisPerYear.length-4].sumfrais];
          this.list3 = [this.fraisPerYear[this.fraisPerYear.length-3].date, this.fraisPerYear[this.fraisPerYear.length-3].sumfrais];
          this.list4 = [this.fraisPerYear[this.fraisPerYear.length-2].date, this.fraisPerYear[this.fraisPerYear.length-2].sumfrais];
          this.list5 = [this.fraisPerYear[this.fraisPerYear.length-1].date, this.fraisPerYear[this.fraisPerYear.length-1].sumfrais];
        }
        else if(this.fraisPerYear.length == 3){
          this.list3 = [this.fraisPerYear[this.fraisPerYear.length-3].date, this.fraisPerYear[this.fraisPerYear.length-3].sumfrais];
          this.list4 = [this.fraisPerYear[this.fraisPerYear.length-2].date, this.fraisPerYear[this.fraisPerYear.length-2].sumfrais];
          this.list5 = [this.fraisPerYear[this.fraisPerYear.length-1].date, this.fraisPerYear[this.fraisPerYear.length-1].sumfrais];
        }
        else if(this.fraisPerYear.length == 2){
          this.list4 = [this.fraisPerYear[this.fraisPerYear.length-2].date, this.fraisPerYear[this.fraisPerYear.length-2].sumfrais];
          this.list5 = [this.fraisPerYear[this.fraisPerYear.length-1].date, this.fraisPerYear[this.fraisPerYear.length-1].sumfrais];
        }
        else if(this.fraisPerYear.length == 1){
          this.list5 = [this.fraisPerYear[this.fraisPerYear.length-1].date, this.fraisPerYear[this.fraisPerYear.length-1].sumfrais];
        }
      
        this.highcharts = Highcharts;
        this.chartOptions = {   
           chart : {
              plotBackgroundColor: '#ebfff0	',
              plotBorderWidth: 2,
              plotShadow: true
           },
           title : {
              text: 'Somme des dépenses par Année'   
           },
          //  subtitle: {
          //     text: 'Source: <a href = "http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
          //  },
           xAxis : {
              type: 'category',
              labels: {
                 rotation: -45,
                 style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                 }
              }
           },
           yAxis : {
              min: 0,
              title: {
                 text: 'Somme dépensée'
              }
           },
           tooltip : {
              pointFormat: 'Somme dépensé : <b>{point.y:.1f} Euro</b>'
           },
           credits : {
              enabled: false
           },
           series : [
              {
                 type: 'column',
                 name: 'Années',
                 data: [
                  this.list1,
                  this.list2,
                  this.list3,
                  this.list4,
                  this.list5
                 ],
                 dataLabels: {
                    enabled: true,
                    rotation: 45,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y:.1f}', // one decimal
                    y: 10, // 10 pixels down from the top
                    style: {
                       fontSize: '13px',
                       fontFamily: 'Verdana, sans-serif'
                    }
                 }
              }
           ]
        };
      }, error => {
        this.error = this.utils.getErrorFromErrorOfServer(error);
      }
    );
  }

}
