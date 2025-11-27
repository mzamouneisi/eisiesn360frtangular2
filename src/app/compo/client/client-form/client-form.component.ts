import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyError } from 'src/app/resource/MyError';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { EsnService } from 'src/app/service/esn.service';
import { UtilsService } from 'src/app/service/utils.service';
import { Address } from '../../../model/address';
import { Client } from '../../../model/client';
import { ClientService } from '../../../service/client.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent extends MereComponent {

  title: string;
  btnSaveTitle: string;

  @Input()
  myObj: Client;
  isAdd: string;
  emailPattern: string = UtilsService.EMAIL_PATTERN;
  telPattern: string = UtilsService.TEL_PATTERN;

  constructor(private route: ActivatedRoute, private router: Router
    , private esnService: EsnService
    , private clientService: ClientService
    , public utils: UtilsService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService);
  }

  ngOnInit() {
    this.initByClient();
  }

  initByClient() {

    ////console.log('initByClient')

    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }

    if (this.isAdd == 'true') {
      this.btnSaveTitle = this.utils.tr("Add")
      this.title = this.utils.tr("NewClient");
      this.myObj = new Client();

      this.myObj.address = new Address();
    } else {
      this.btnSaveTitle = this.utils.tr("Save")
      this.title = this.utils.tr("EditClient")
      let clientP: Client = this.clientService.getClient();
      ////console.log('clientP='+clientP);

      if (clientP != null) this.myObj = clientP;
      else if (this.myObj == null) this.myObj = new Client();

      this.esnService.majClient(this.myObj)
    }

    if (!this.myObj.esn) {
      this.esnService.majClient(this.myObj)
    }

    if (!this.myObj.esn) {
      this.myObj.esn = this.getEsnCurrent();
      if (this.myObj.esn && this.myObj.esn.id) this.myObj.esnId = this.myObj.esn.id
    }

  }

  onSubmit() {
    ////console.log(this.myObj);
    this.beforeCallServer("onSubmit");
    if (!this.myObj.esn) {
      this.myObj.esn = this.esnCurrent;
      if (!this.myObj.esn) {
        this.myObj.esn = this.userConnected.esn
      }
    }
    if (this.myObj.esn && this.myObj.esn.id) this.myObj.esnId = this.myObj.esn.id

    if (!this.myObj.esnId) {
      this.myObj.esnId = this.myObj.esn?.id
    }

    console.log("onSubmit this.myObj.esn : ", this.myObj.esn)
    if(!this.myObj.esn) {
      this.addError(new MyError("", "esn absente !! "))
      return 
    }

    this.clientService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)

        if (!this.isError()) this.gotoClientList()
      },
      error => {
        this.addErrorFromErrorOfServer("onSubmit", error);

      }
    );
  }


  gotoClientList() {
    this.clearInfos();
    this.router.navigate(['/client_list']);
  }
}
