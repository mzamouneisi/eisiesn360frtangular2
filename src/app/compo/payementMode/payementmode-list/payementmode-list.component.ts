import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { PayementMode } from '../../../model/payementMode';
import { PayementModeService } from '../../../service/payement-mode.service';
import { UtilsService } from '../../../service/utils.service';
import { MereComponent } from '../../_utils/mere-component';
import { PayementmodeFormComponent } from '../payementmode-form/payementmode-form.component';

@Component({
  selector: 'app-payementmode-list',
  templateUrl: './payementmode-list.component.html',
  styleUrls: ['./payementmode-list.component.css']
})
export class PayementmodeListComponent extends MereComponent {
  title: string = "";

  myList: PayementMode[];
  myObj: PayementMode;
  @ViewChild('payementModeDetail', { static: false }) payementModeDetail: PayementmodeFormComponent;

  getTitle() {
    let nbElement = 0
    if (this.myList != null) nbElement = this.myList.length
    this.title = this.utils.tr("List") + " " + "PayementsModes" + " (" + nbElement + ")"
    return this.title
  }

  constructor(private payementModeService: PayementModeService,
    private router: Router,
    public utils: UtilsService
    , protected utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService);

    this.colsSearch = ["id", "name"]
  }
  ngOnInit() {
    this.findAll();
  }

  findAll() {
    this.beforeCallServer("findAll")
    this.payementModeService.findAll().subscribe(
      data => {
        this.afterCallServer("findAll", data)
        this.myList = data.body.result;
        this.myList00 = this.myList;
      }, error => {
        this.addErrorFromErrorOfServer("findAll", error);
        //console.log(error);
      }
    );
  }

  setMyList(myList: any[]) {
    this.myList = myList;
  }

  showForm(payementMode: PayementMode) {
    this.myObj = payementMode;
    if (this.payementModeDetail != null) {
      this.payementModeDetail.myObj = this.myObj;
      this.payementModeDetail.isAdd = 'false';
      this.payementModeDetail.ngOnInit();
    }
  }

  edit(payementMode: PayementMode) {
    this.clearInfos();
    this.payementModeService.setPayementMode(payementMode);
    this.router.navigate(['/payementmode_form']);
  }

  getIdOfCurentObj() {
    return this.myObj != null ? this.myObj.id : -1;
  }

  delete(myObj) {
    let mythis = this;
    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, mythis
      , () => {
        mythis.beforeCallServer("delete")
        mythis.payementModeService.deleteById(myObj.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data)
              if (!this.isError()) {
                mythis.findAll();
                mythis.myObj = null;
              }
            }, error => {
              mythis.addErrorFromErrorOfServer("delete", error);
              // //console.log(error);
            }
          );
      }
      , null
    );

  }

}
