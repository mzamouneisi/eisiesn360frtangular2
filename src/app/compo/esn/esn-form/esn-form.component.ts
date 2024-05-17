import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  telPattern: string =   UtilsService.TEL_PATTERN;

  constructor(private route: ActivatedRoute, private router: Router, private esnService: EsnService     , public utils: UtilsService
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
      this.title = this.utils.tr("New") + " ESN" ;
      this.myObj = new Esn();
    } else {
      this.btnSaveTitle = this.utils.tr("Save")
      this.title = this.utils.tr("Edit") + " ESN" ;
      let esnP: Esn = this.esnService.getEsn();
      ////console.log('esnP='+esnP);

      if (esnP != null) this.myObj = esnP;
      else if (this.myObj == null) this.myObj = new Esn();
    }
  }


  onSubmit() {
    console.log( "onSubmit: ", this.myObj);
    this.beforeCallServer("onSubmit");
    this.esnService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)
        console.log( "onSubmit: isError:", this.isError());
        if (!this.isError()) {
          // this.gotoEsnList()
          // console.info("data: " , data)
          if(data && data.body && data.body.result) {
            this.myObj = data.body.result
            this.gotoAddResponsibleEsn(this.myObj);
          }
        }
      },
      error => {
        console.log( "onSubmit: error:", error);
        this.addErrorFromErrorOfServer("onSubmit", error);
        ;
      }
    );
  }

  gotoAddResponsibleEsn(esn: Esn) {
    this.clearInfos();
    this.utils.navigateToUrl('/consultant_form', {isAdd:true, role:'resp', esnIdStr:esn.id});
  }

  gotoEsnList() {
    this.clearInfos();
    this.router.navigate(['/esn_list']);
  }
}
