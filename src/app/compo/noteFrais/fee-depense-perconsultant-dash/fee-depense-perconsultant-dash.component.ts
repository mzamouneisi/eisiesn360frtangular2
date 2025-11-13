import { Component, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Consultant } from 'src/app/model/consultant';
import { FraisConsultantDashboard } from 'src/app/model/fraisConsultantDashboard';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { NoteFraisDashboardService } from 'src/app/service/note-frais-dashboard.service';
import { UtilsService } from 'src/app/service/utils.service';
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-fee-depense-perconsultant-dash',
  templateUrl: './fee-depense-perconsultant-dash.component.html',
  styleUrls: ['./fee-depense-perconsultant-dash.component.css']
})
export class FeeDepensePerconsultantDashComponent extends MereComponent {
  highcharts = Highcharts;
  chartOptions: any

  fraisConsultant: FraisConsultantDashboard[];
  error: any;
  currentYear: number = (new Date()).getFullYear();
  listConsultant: Consultant[];
	consultantSelected: Consultant = this.userConnected;
  	// consultantSelected: Consultant 
	selectConsultantLabel: string = this.utils.tr("Consultant:")
  fraisPerMonth: any;
  load: boolean = true;


  constructor(
    private noteFraisDashboardService: NoteFraisDashboardService,
    public utils: UtilsService,
    public dataSharingService: DataSharingService,
    private consultantService: ConsultantService
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit(): void {
    this.getAllConsultant();
    this.getDepensesPerConsultant();
    this.getDepensesConsultantPerMonth();	
  }

  getClassListConsultant() {
    return this.load ? 'list_consultant_loading' : 'list_consultant'
  }

  getAllConsultant() {
    console.log("*** dbg getAllConsultant")
    this.consultantService.findAll().subscribe(
      data => {
        console.log("*** dbg getAllConsultant : data : ", data)
        this.listConsultant = data.body.result;

        setTimeout(() => {
          this.onSelectConsultant(this.consultantSelected)
        }, 1000);
      }, error => {
        console.log("*** dbg getAllConsultant : error : ", error)
        this.addErrorFromErrorOfServer('consultantSelect',error);
      }
    );
  }

  @ViewChild('fee-fep-perconsultant-slect-consultant', {static:false}) compoSelectConsultant:SelectComponent ;
  selectConsultant(consultant:Consultant){
      this.compoSelectConsultant.selectedObj = consultant;
  }

  onSelectConsultant(c: Consultant) {
    this.load = false;
		this.consultantSelected = c;
    this.getDepensesConsultantPerMonth();	    
	} 

  getDepensesPerConsultant() {
    console.log("*** dbg getDepensesPerConsultant")
    this.error = null;
    this.noteFraisDashboardService.getAllFraisConsultantDashboard().subscribe(
      data => {
        console.log("*** dbg getDepensesPerConsultant : data : ", data)
        this.fraisConsultant = data.body.result;
        let pieData: any[] = [];
        let columunData: any[] = [];
        let name = this.fraisConsultant.map(n => n.firstname + ' ' + n.lastname);
        let sumFrais = this.fraisConsultant.map(n => n.somme);
        for (var i = 0; i < this.fraisConsultant.length; i++) {
          columunData.push({
            "y": this.fraisConsultant[i].somme,
            "color": this.listClolors[i]
          })
          pieData.push({
            "name": this.fraisConsultant[i].firstname + ' ' + this.fraisConsultant[i].lastname,
            "y": this.fraisConsultant[i].somme,
            "color": this.listClolors[i]
          })
        }
        this.chartOptions = {
          chart: {
            type: 'column',
            plotBackgroundColor: '#faffcc	',
            plotBorderWidth: 2,
            plotShadow: true,
            //width: 100,
          },

          title: {
            text: 'Dépenses des consultants / ' + this.currentYear
          },
          xAxis: {
            categories: name
          },

          series: [
            {
              name: 'Dépenses',
              data: columunData,
            },

            {
              type: 'pie',
              name: 'Totale dépensé',
              data: pieData,
              center: [0, 0],
              size: 70,
              showInLegend: false,
              dataLabels: {
                enabled: false
              }
            },
          ]
        }
      }, error => {
        console.log("*** dbg getDepensesPerConsultant : error : ", error)
        this.error = this.utils.getErrorFromErrorOfServer(error);
      }
    );
  }

  getDepensesConsultantPerMonth() {
    this.error = null;
    console.log("*** dbg getDepensesConsultantPerMonth : consultantSelected : ", this.consultantSelected)

    this.noteFraisDashboardService.getAllFraisConsultantPerMonth(this.consultantSelected.id).subscribe(
      data => {
        console.log("*** dbg getDepensesConsultantPerMonth : data : ", data)
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
            text: "Dépenses "+this.consultantSelected.firstName+" "+this.consultantSelected.lastName+" / "+ this.currentYear
          },
          xAxis: {
            title: {
              text: "Mois / "+ this.currentYear
            },
            categories: this.fraisPerMonth.map(a => a.month)
          },
          yAxis: {
            title: {
              text: "Somme dépensée"
            }
          },
          series: [{
            data: this.fraisPerMonth.map(a => a.somme),
            type: 'spline'
          }]
        }
      }, error => {
        console.log("*** dbg getDepensesConsultantPerMonth : error : ", error)
        this.error = this.utils.getErrorFromErrorOfServer(error);
      }
    );
  }

  listClolors: string[] = [
    "#87fad1", "#ff958f", "#f15c80", "#7cb5ec", "#434348", "#f7a35c", "#8085e9",
    "#8085e9", "#a48a9e", "#14a9ad", "#99eaff", "#f205e6", "#4ca2f9", "#a4e43f",
    "#d2737d", "#c0a43c", "#f2510e", "#651be6", "#79806e", "#61da5e", "#cd2f00",
    "#9348af", "#01ac53", "#c5a4fb", "#996635", "#b11573", "#4bb473", "#75d89e",
    "#2f3f94", "#2f7b99", "#da967d", "#34891f", "#b0d87b", "#ca4751", "#7e50a8",
  ];


}
