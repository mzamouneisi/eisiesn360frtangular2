import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Consultant } from 'src/app/model/consultant';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
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

  constructor(private route: ActivatedRoute, private router: Router, private esnService: EsnService, private consultantService: ConsultantService
    , public utils: UtilsService
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
          // this.gotoEsnList()
          console.info("data: ", data)
          if (data && data.body && data.body.result) {
            // this.myObj = data.body.result
            // this.gotoAddResponsibleEsn(this.myObj);
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
    if (resp.hideSSConsultants == null) resp.hideSSConsultants = true

    resp.hideSSConsultants = !resp.hideSSConsultants;
    if (resp.listConsultants == null) {
      this.beforeCallServer("getListConsultants")
      this.consultantService.findAllChildConsultants(resp).subscribe(
        data => {
          console.log("findAllChildConsultants : data", data)
          this.afterCallServer("getListConsultants", data)
          if (data != null && data.body != null) {
            resp.listConsultants = data.body.result;
          }
        }, error => {
          this.addErrorFromErrorOfServer("getListConsultants", error);
        }
      );
    }
  }

  getListCra(consultant: Consultant) {

    if (consultant.hideListCra == null) consultant.hideListCra = true

    consultant.hideListCra = !consultant.hideListCra;

    console.log("listCra " , consultant.listCra)
      // this.beforeCallServer("findAll");
      // this.craService.findAll().subscribe(
      //   data => {
      //     console.log("cra list findAll data:", data)
      //     this.afterCallServer("findAll", data);
      //     // this.info00 = ''
      //     this.myList = data.body.result;
      //     this.myList00 = this.myList;
      //     this.dataSharingService.listCra = this.myList;
  
      //     // //////////console.log("**********"+JSON.stringify(this.myList))
      //     if (!this.isError() && this.myList && this.myList.length>0) this.myList = this.myList.sort((a, b) => this.compareCraDesc(a, b))
  
      //     this.getListConsultants();
      //   }, error => {
      //     console.log("cra list findAll error:", error)
      //     this.addErrorFromErrorOfServer("findAll", error);
      //     //console.log(error);
      //   }
      // );
      // this.getFilteredCra();
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
