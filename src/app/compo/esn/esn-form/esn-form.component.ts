import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Consultant } from 'src/app/model/consultant';
import { Cra } from 'src/app/model/cra';
import { ConsultantService } from 'src/app/service/consultant.service';
import { CraService } from 'src/app/service/cra.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Esn } from '../../../model/esn';
import { EsnService } from '../../../service/esn.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-esn-form',
  templateUrl: './esn-form.component.html',
  styleUrls: ['./esn-form.component.css']
})
export class EsnFormComponent extends MereComponent {

  title: string;
  btnSaveTitle: string;

  @Input()
  myObj: Esn;
  isAdd: string;
  emailPattern: string = UtilsService.EMAIL_PATTERN;
  telPattern: string = UtilsService.TEL_PATTERN;

  constructor(private route: ActivatedRoute, private router: Router, private esnService: EsnService
    , private consultantService: ConsultantService, private craService: CraService
    , public utils: UtilsService, protected utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService
    );

  }

  ngOnInit() {
    this.initByEsn();
  }

  initByEsn() {

    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }

    if (this.isAdd == 'true') {
      this.btnSaveTitle = this.utils.tr("Add")
      this.title = this.utils.tr("New") + " ESN";
      this.myObj = new Esn();
    } else {
      this.btnSaveTitle = this.utils.tr("Save")
      this.title = this.utils.tr("Edit") + " ESN";
      let esnP: Esn = this.esnService.getEsn();
      console.log('esn-form : esnP=', esnP);

      if (esnP != null) {
        this.myObj = esnP;

      }
      else if (this.myObj == null) this.myObj = new Esn();
    }
  }

  onSubmit() {
    console.log("onSubmit: ", this.myObj);
    this.beforeCallServer("onSubmit");
    // this.esnService.setEsn(this.myObj);
    this.esnService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)
        console.log("onSubmit: isError:", this.isError());
        if (!this.isError()) {
          console.info("data: ", data)
          if (data && data.body && data.body.result) {
            this.myObj = data.body.result
            this.gotoEsnList();
          }
        }
      },
      error => {
        console.log("onSubmit: error:", error);
        this.addErrorFromErrorOfServer("onSubmit", error);
        ;
      }
    );
  }

  getListConsultants(resp: Consultant) {

    if (resp.listConsultant == null) {
      this.beforeCallServer("getListConsultants")
      this.consultantService.findAllChildConsultants(resp).subscribe(
        data => {
          console.log("findAllChildConsultants : data", data)
          this.afterCallServer("getListConsultants", data)
          if (data != null && data.body != null) {
            resp.listConsultant = data.body.result;
          }
        }, error => {
          this.addErrorFromErrorOfServer("getListConsultants", error);
        }
      );
    }
  }

  deleteConsultant(consultant: Consultant, manager: Consultant) {
    let mythis = this;
    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer le consultant " + consultant.username, mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.consultantService.deleteById(consultant.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data);
              if (!this.isError()) {
                manager.listConsultant = null
                mythis.getListConsultants(manager);
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

  getListCra(consultant: Consultant) {

    console.log("listCra ", consultant.listCra)

    if (consultant.listCra == null) {
      this.beforeCallServer("getListCra");
      this.craService.getListCraOfUser(consultant.username).subscribe(
        data => {
          console.log("cra list getListCra data:", data)
          this.afterCallServer("getListCra", data);
          // this.info00 = ''
          consultant.listCra = data.body.result;

          console.log("listCra ", consultant.listCra)

        }, error => {
          console.log("cra list getListCra error:", error)
          this.addErrorFromErrorOfServer("getListCra", error);
          //console.log(error);
        }
      );
    }
  }

  deleteCra(cra: Cra, consultant: Consultant) {
    let mythis = this;
    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer le cra " + mythis.infoCra(cra), mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.craService.deleteById(cra.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data);
              if (!this.isError()) {
                consultant.listCra = null
                mythis.getListCra(consultant);
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

  infoCra(cra: Cra) {
    return cra.month + ":" + cra.nbDayWorked + "day : " + cra.status
  }



  // gotoAddResponsibleEsn(esn: Esn) {
  //   this.clearInfos();
  //   this.utils.navigateToUrl('/consultant_form', {isAdd:true, role:'resp', esnIdStr:esn.id});
  // }

  gotoEsnList() {
    this.clearInfos();
    this.router.navigate(['/esn_list']);
  }
}
