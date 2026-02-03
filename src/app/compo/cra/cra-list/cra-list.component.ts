import { DatePipe } from "@angular/common";
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Consultant } from 'src/app/model/consultant';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Cra } from '../../../model/cra';
import { ConsultantService } from "../../../service/consultant.service";
import { CraService } from '../../../service/cra.service';
import { DataSharingService } from "../../../service/data-sharing.service";
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';
import { CraFormCalComponent } from '../cra-form/cra-form-cal.component';

@Component({
  selector: 'app-cra-list',
  templateUrl: './cra-list.component.html',
  styleUrls: ['./cra-list.component.css']
})
export class CraListComponent extends MereComponent {

  // info00: string = '' ;

  title: string = "List Cra/" + this.utils.tr('Conge')
  myList: Cra[];
  listCraFiltred: Cra[];
  consultants: Consultant[];

  currentCra: Cra;
  @ViewChild('craDetailCal', { static: false }) craDetailCal: CraFormCalComponent;

  filterConsultant: Consultant = new Consultant();
  filterMonth: Date = new Date();

  p1: any; p2: any

  constructor(private craService: CraService,
    private router: Router
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
    , protected utilsIhm: UtilsIhmService
    , private consultantService: ConsultantService
    , private datePipe: DatePipe) {

    super(utils, dataSharingService);

    this.colsSearch = ["consultantUsername", "month", "createdDate", "lastModifiedDate"]
  }

  ngOnInit() {

    console.log("cla-list ngOnInit userConnected", this.userConnected)

    this.dataSharingService.getNotifications(null, null);

    this.findAll();

  }

  getTitle() {

    let nbElement = 0
    if (this.myList != null) nbElement = this.myList.length
    let t = this.title + " (" + nbElement + ")"
    return t
  }

  setMyList(myList: any[]) {
    this.myList = myList;
  }

  findAll() {
    this.beforeCallServer("findAll");
    this.craService.findAll().subscribe(
      data => {
        console.log("cra list findAll data:", data)
        this.afterCallServer("findAll", data);
        // this.info00 = ''
        this.myList = data.body.result;
        this.myList00 = this.myList;
        this.dataSharingService.setListCra(this.myList);

        this.dataSharingService.majListCra();

        console.log("cra list findAll myList:", this.myList)
        console.log("cra list findAll dataSharingService.listCra:", this.dataSharingService.getListCra())

        // //////////console.log("**********"+JSON.stringify(this.myList))
        if (!this.isError() && this.myList && this.myList.length > 0) this.myList = this.myList.sort((a, b) => this.compareCraDesc(a, b))

        this.getListConsultants();
      }, error => {
        console.log("cra list findAll error:", error)
        this.addErrorFromErrorOfServer("findAll", error);
        //console.log(error);
      }
    );
    this.getFilteredCra();
  }

  saveListCra(list: Cra[]) {
    for (let cra of list) {
      this.saveCra(cra);
    }
  }

  saveCra(cra: Cra) {
    this.beforeCallServer("saveCra")
    this.craService.save(cra).subscribe(
      data => {
        this.afterCallServer("saveCra", data)
        //////console.log("saveCra data=", data)
      }, error => {
        this.addErrorFromErrorOfServer("saveCra", error);
        //////console.log("saveCra error=", error)
      })
  }

  compareCraDesc(a: Cra, b: Cra) {
    return b.month.toString().localeCompare(a.month.toString());
  }

  getClassButtonShowCra(cra: Cra) {
    let t = "btn btn-outline-primary"
    if (cra.type == 'CONGE') t = "btn btn-outline-primary bg-conge";
    return t;
  }

  getTitleButtonShowCra(cra: Cra) {
    let t = this.utils.tr("app.compo.cra.list.table.action.showDetails")
    if (cra.type == 'CONGE') t = this.utils.tr("showConge");
    return t;
  }

  addNewCra() {
    this.clearInfos();
    this.dataSharingService.typeCra = "CRA"
    this.router.navigate(['/cra_form'], { queryParams: { 'isAdd': 'true' } });
  }

  showCra(cra: Cra, event: any) {
    console.log("showCra craList ", cra)
    this.clearInfos()
    this.dataSharingService.showCra(cra);
  }

  edit(cra: Cra) {
    this.clearInfos();
    this.craService.setCra(cra);
    this.router.navigate(['/cra_form']);
  }

  delete(myObj: Cra) {
    let mythis = this;
    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.craService.deleteById(myObj.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data);
              if (!this.isError()) {
                mythis.findAll();
                mythis.currentCra = null;
              }
            }, error => {
              mythis.addErrorFromErrorOfServer("delete", error);
              ////console.log(error);
            }
          );
      }
      , null
    );
  }

  canDeleteCra(myObj: Cra) {
    let cond = !myObj.validByConsultant && myObj.id != null;

    if (this.dataSharingService.isCurrenUserRespOrAdmin()) {
      return myObj.id != null;
    } else {
      return cond;
    }

  }

  getIdOfCurentCra() {
    return this.currentCra != null ? this.currentCra.id : -1;
  }

  /****
   * this method used to verify the current user has role for show the cra of consultants or no
   */
  accessCraConsultants() {
    let currentUser = this.dataSharingService.userConnected
    if (currentUser.role == "MANAGER" || currentUser.role == "RESPONSIBLE_ESN" || currentUser.role == "ADMIN") return true;
    return false;
  }

  getFilteredCra() {
    let month: string = null;
    if (this.filterMonth) month = this.datePipe.transform(this.filterMonth, 'yyyy-MM');
    //////////console.log("getFilteredCra", this.filterConsultant.username, month );
    this.beforeCallServer("getFilteredCra");
    this.craService.getFilteredCra(this.filterConsultant.username, month).subscribe(
      data => {
        this.afterCallServer("getFilteredCra", data);
        this.listCraFiltred = data.body.result;
        this.dataSharingService.majListCraParam(this.listCraFiltred)
        console.log("**** showCra getFilteredCra: listCraFiltred=", this.listCraFiltred);

        // this.saveListCra(this.listCraFiltred)

        if (!this.isError()) this.listCraFiltred = this.listCraFiltred.sort((a, b) => this.compareCraDesc(a, b))
        //////////console.log("**** getFilteredCra: listCraFiltred=", this.listCraFiltred);
      }, error => {
        this.addErrorFromErrorOfServer("getFilteredCra", error);
        ////console.log(error);
        //////////console.log("**** getFilteredCra: error=", error);

      }
    );
  }

  // @ViewChild("mydate", {static: false}) mydate: MyDatePicker;
  deleteFilterMonth() {
    this.filterMonth = null;
    // this.mydate.writeValue("")
  }

  onSelectConsultant(consultant: Consultant) {
    this.filterConsultant = consultant;
    if (this.filterConsultant == null) this.filterConsultant = new Consultant();
  }

  @ViewChild('compoSelectConsultant', { static: false }) compoSelectConsultant: SelectComponent;
  selectConsultant(consultant: Consultant) {
    this.compoSelectConsultant.selectedObj = consultant;
  }

  getListConsultants() {
    this.beforeCallServer("getListConsultants")
    this.consultantService.findAll().subscribe(
      data => {
        this.afterCallServer("getListConsultants", data)
        this.consultants = data.body.result;
      }, error => {
        this.addErrorFromErrorOfServer("getListConsultants", error);
      }
    );
  }

}
