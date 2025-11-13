import { Component } from '@angular/core';
import { FeeDepensesGeneral } from 'src/app/model/feeDepensesGeneral';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { NoteFraisDashboardService } from 'src/app/service/note-frais-dashboard.service';
import { UtilsService } from 'src/app/service/utils.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-fee-depense-info-dash',
  templateUrl: './fee-depense-info-dash.component.html',
  styleUrls: ['./fee-depense-info-dash.component.css']
})
export class FeeDepenseInfoDashComponent extends MereComponent {
  error: any;
  feeDepensesGeneral: FeeDepensesGeneral;
  

  constructor(
    private noteFraisDashboardService: NoteFraisDashboardService,
    public utils: UtilsService,
    public dataSharingService: DataSharingService
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit(): void {
    this.getGeneralInfoDepenses();
  }

  getGeneralInfoDepenses(){
    this.error = null;
    this.noteFraisDashboardService.getDepensesGeneral().subscribe(
      data => {
        this.feeDepensesGeneral = data.body.result;
        console.log("getGeneralInfoDepenses feeDepensesGeneral : ", this.feeDepensesGeneral)
      }, error => {
        console.log("getGeneralInfoDepenses error : ", error)
        this.error = this.utils.getErrorFromErrorOfServer(error);
      }
    );

  }

}
