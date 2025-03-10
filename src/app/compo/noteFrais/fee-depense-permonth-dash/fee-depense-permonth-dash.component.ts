import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { FraisPerDateDashboard } from 'src/app/model/fraisPerDateDashboard';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { NoteFraisDashboardService } from 'src/app/service/note-frais-dashboard.service';
import { UtilsService } from 'src/app/service/utils.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-fee-depense-permonth-dash',
  templateUrl: './fee-depense-permonth-dash.component.html',
  styleUrls: ['./fee-depense-permonth-dash.component.css']
})
export class FeeDepensePermonthDashComponent extends MereComponent {
  highcharts = Highcharts;
  chartOptions: Highcharts.Options
  fraisPerMonth: FraisPerDateDashboard[];
  error: any;
  currentYear: number;


  constructor(
    private noteFraisDashboardService: NoteFraisDashboardService,
    public utils: UtilsService,
    public dataSharingService: DataSharingService
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit(): void {
    this.currentYear = (new Date()).getFullYear()
    this.getDepensesPerMonth();
  }

  getDepensesPerMonth() {
    this.error = null;
    this.noteFraisDashboardService.getAllFraisPerMonthDashboard().subscribe(
      data => {
        //getting data from the server
        this.fraisPerMonth = data.body.result;
        //mapping data in the dashboard
        this.chartOptions = {
          chart: {
            plotBackgroundColor: '#fbeaf3	',
            plotBorderWidth: 2,
            plotShadow: true,
          },
          title: {
            text: "Dépenses par Mois / "+ this.currentYear
          },
          xAxis: {
            title: {
              text: "Mois / "+ this.currentYear
            },
            categories: this.fraisPerMonth.map(a => a.date)
          },
          yAxis: {
            title: {
              text: "Somme dépensée"
            }
          },
          series: [{
            data: this.fraisPerMonth.map(a => a.sumfrais),
            type: 'spline'
          }]
        }
      }, error => {
        this.error = this.utils.getErrorFromErrorOfServer(error);
      }
    );
  }

}
