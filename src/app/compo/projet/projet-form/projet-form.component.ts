import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IDatePickerDirectiveConfig} from 'ng2-date-picker';
import {ProjetService} from '../../../service/projet.service';
import {Project} from '../../../model/project';
import {Client} from 'src/app/model/client';
import {ClientService} from 'src/app/service/client.service';
import {UtilsService} from 'src/app/service/utils.service';
import { MereComponent } from '../../_utils/mere-component';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';

@Component({
  selector: 'app-projet-form',
  templateUrl: './projet-form.component.html',
  styleUrls: ['./projet-form.component.css']
})
export class ProjetFormComponent extends MereComponent {

  title: string;
  btnSaveTitle: string;
  isAdd: string;

  @Input()
  myObj: Project;

  @ViewChild('compoSelectClient', {static:false}) compoSelectClient:SelectComponent ;

  clients: Client[];
  dateOptions: IDatePickerDirectiveConfig = {format: 'YYYY-MM-DDTHH:mm:ss.SSSZ',};

  constructor(private route: ActivatedRoute, private router: Router
    , private projetService: ProjetService
    , private clientService: ClientService
    , public utils: UtilsService
    , protected dataSharingService: DataSharingService  ) {
      super(utils, dataSharingService);

  }

  ngOnInit() {
    this.initByProjet();
    this.getClients();
  }

  initByProjet() {

    ////console.log('initByProjet');

    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }

    if (this.isAdd == 'true') {
      this.btnSaveTitle = this.utils.tr("Add");
      this.title = this.title = this.utils.tr("New") + " " + this.utils.tr("Project") ;
      this.myObj = new Project();
    } else {
      this.btnSaveTitle = this.utils.tr("Save");
      this.title = this.title = this.utils.tr("Edit") + " " + this.utils.tr("Project") ;
      let projetP: Project = this.projetService.getProjet();
      ////console.log(projetP);

      if (projetP != null) {
        this.myObj = projetP;
      } else if (this.myObj == null) {
        this.myObj = new Project();
      }
    }
  }


  getClients() {
    this.beforeCallServer("getClients");
    this.clientService.findAll(this.getEsnId()).subscribe(
      data => {
        this.afterCallServer("getClients", data)
        this.clients = data.body.result;
        if (data == undefined) {
          this.clients = new Array();
        }

        if (this.isAdd != 'true') {
          this.selectClient(this.myObj.client);
        }
      }, error => {
        this.addErrorFromErrorOfServer("getClients", error);
        ////console.log(error);
      }
    );
  }

  selectClient(client:Client) {
    if (client && this.compoSelectClient) {
      this.compoSelectClient.selectedObj = client;
    }
  }  

  onSelectClient(client: Client) {
    this.myObj.client = client;
  }

  getClientIndexById(clientId: number): number {
    let res = -1;
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].id == clientId) {
        return i;
      }
    }
    return res;
  }

  onSubmit() {
    ////console.log(this.myObj);
    this.beforeCallServer("onSubmit");
    this.projetService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)
        
        if (!this.isError()) this.gotoProjetList();
      },
      error => {
        this.addErrorFromErrorOfServer("onSubmit", error);
        
      }
    );
  }

  gotoProjetList() {
    this.clearInfos();
    this.router.navigate(['/projet_list']);
  }
}
