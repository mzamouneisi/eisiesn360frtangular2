import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientService} from '../../../service/client.service';
import {Client} from '../../../model/client';
import {Address} from '../../../model/address';
import {UtilsService} from 'src/app/service/utils.service';
import { MereComponent } from '../../_utils/mere-component';
import { DataSharingService } from 'src/app/service/data-sharing.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent extends MereComponent {

  title: string ;
  btnSaveTitle: string;

  @Input()
  myObj: Client;
  isAdd: string;
  emailPattern: string = UtilsService.EMAIL_PATTERN;
  telPattern: string =   UtilsService.TEL_PATTERN;

  constructor(private route: ActivatedRoute, private router: Router, private clientService: ClientService     , public utils: UtilsService
    , protected dataSharingService: DataSharingService) {
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
      this.btnSaveTitle =  this.utils.tr("Save")
      this.title = this.utils.tr("EditClient")
      let clientP: Client = this.clientService.getClient();
      ////console.log('clientP='+clientP);

      if (clientP != null) this.myObj = clientP;
      else if (this.myObj == null) this.myObj = new Client();
    }
  }

  onSubmit() {
    ////console.log(this.myObj);
    this.beforeCallServer("onSubmit");
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
