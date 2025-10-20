import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { FraisCategoryDashboard } from 'src/app/model/fraisCategoryDashboard';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { NoteFraisDashboardService } from 'src/app/service/note-frais-dashboard.service';
import { UtilsService } from 'src/app/service/utils.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-fee-depense-percategory-dash',
  templateUrl: './fee-depense-percategory-dash.component.html',
  styleUrls: ['./fee-depense-percategory-dash.component.css']
})
export class FeeDepensePercategoryDashComponent extends MereComponent {
  highcharts = Highcharts;
  chartOptions: any
  fraisCategory: FraisCategoryDashboard[];
  error: any;
  currentYear: number = (new Date()).getFullYear();

  constructor(
    private noteFraisDashboardService: NoteFraisDashboardService,
    public utils: UtilsService,
    public dataSharingService: DataSharingService
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit(): void {
    this.getDepensesPerCategory();
  }

  getDepensesPerCategory() {
    this.error = null;
    this.noteFraisDashboardService.getAllFraisPerCategoryDashboard().subscribe(
      data => {
        let pieData: any[]=[]; 
        this.fraisCategory = data.body.result;
        let max = Math.max.apply(Math, this.fraisCategory.map(function(o) { return o.sumFraisThisYear; }));
        for(var i = 0; i < this.fraisCategory.length; i++){
          if(this.fraisCategory[i].sumFraisThisYear == max){
            pieData.push({
              "name" : this.fraisCategory[i].categoryName,
              "y" : this.fraisCategory[i].sumFraisThisYear,
              "sliced" : true,
              "selected" : true
            })
          } else{
            pieData.push({
              "name" : this.fraisCategory[i].categoryName,
              "y" : this.fraisCategory[i].sumFraisThisYear,
              "sliced" : false,
              "selected" : false
            })
          }
         
        }
        this.chartOptions = {
          chart: {
            plotBackgroundColor: '#ffebe3	',
            plotBorderWidth: 2,
            plotShadow: true,
            type: 'pie'
          },
          title: {
            text: 'Somme des dépenses par Catégorie / '+this.currentYear
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
            }
          },
          series: [{
            name: 'Brands',
            colorByPoint: true,
            type: 'pie',
            data: pieData
        }]
      }
      }, error => {
        this.error = this.utils.getErrorFromErrorOfServer(error);
      }
    );
  }
}


