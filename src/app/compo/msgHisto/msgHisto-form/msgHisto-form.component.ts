import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDatePickerDirectiveConfig } from 'ng2-date-picker';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { MsgHisto } from '../../../model/msgHisto';
import { MsgHistoService } from '../../../service/msgHisto.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-msgHisto-form',
  templateUrl: './msgHisto-form.component.html',
  styleUrls: ['./msgHisto-form.component.css']
})
export class MsgHistoFormComponent extends MereComponent {

  title: string = "MsgHisto Form"
  btnSaveTitle: string = "Add"
  isAdd: string;

  @Input()
  myObj: MsgHisto;

  dateOptions: IDatePickerDirectiveConfig = { format: "YYYY-MM-DDTHH:mm:ss.SSSZ", };

  constructor(private route: ActivatedRoute, private router: Router
    , private msgHistoService: MsgHistoService
    , private consultantService: ConsultantService
    , public utils: UtilsService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService);

  }

  ngOnInit() {
    this.initByMsgHisto();
  }

  initByMsgHisto() {

    ////console.log('initByMsgHisto')
    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }
    ////console.log(isAdd)

    if (this.isAdd == 'true') {
      this.btnSaveTitle = "Add"
      this.title = "Nouveau MsgHisto"
      this.myObj = new MsgHisto();
    } else {
      this.btnSaveTitle = "Save"
      this.title = "Edit MsgHisto"
      let msgHistoP: MsgHisto = this.msgHistoService.getMsgHisto();
      ////console.log('msgHistoP='+msgHistoP);

      if (msgHistoP != null) this.myObj = msgHistoP;
      else if (this.myObj == null) this.myObj = new MsgHisto();
    }

    this.consultantService.majMsgHisto(this.myObj)
  }

  onSubmit() {
    ////console.log(this.myObj);
    this.beforeCallServer("onSubmit");
    this.msgHistoService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)

        if (!this.isError()) this.gotoMsgHistoList()
      },
      error => {
        this.addErrorFromErrorOfServer("onSubmit", error);
        ;
      }
    );
  }

  gotoMsgHistoList() {
    this.clearInfos();
    this.router.navigate(['/msgHisto_list']);
  }
}