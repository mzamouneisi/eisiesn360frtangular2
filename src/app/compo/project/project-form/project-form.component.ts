import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDatePickerDirectiveConfig } from 'ng2-date-picker';
import { Client } from 'src/app/model/client';
import { ClientService } from 'src/app/service/client.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { ProjectService } from 'src/app/service/project.service';
import { UtilsService } from 'src/app/service/utils.service';
import { Project } from '../../../model/project';
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent extends MereComponent {

  title: string;
  btnSaveTitle: string;
  isAdd: string;

  @Input()
  myObj: Project;

  @ViewChild('compoSelectClient', {static:false}) compoSelectClient:SelectComponent ;

  clients: Client[];
  dateOptions: IDatePickerDirectiveConfig = {format: 'YYYY-MM-DDTHH:mm:ss.SSSZ',};

  constructor(private route: ActivatedRoute, private router: Router
    , private projectService: ProjectService
    , private clientService: ClientService
    , public utils: UtilsService
    , public dataSharingService: DataSharingService  ) {
      super(utils, dataSharingService);

  }

  ngOnInit() {
    this.initByProject();
    this.getClients();
  }

  initByProject() {

    ////console.log('initByProject');

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
      let projectP: Project = this.projectService.getProject();
      ////console.log(projectP);

      if (projectP != null) {
        this.myObj = projectP;
      } else if (this.myObj == null) {
        this.myObj = new Project();
      }
    }

    this.clientService.majProject(this.myObj)
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
    let info_id = "onSubmit add proj"
    this.beforeCallServer(info_id);
    console.log("client : " , this.myObj.client)
    this.projectService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer(info_id, data)
        
        if (!this.isError()) this.gotoProjectList();
      },
      error => {
        this.addErrorFromErrorOfServer(info_id, error);
        
      }
    );
  }

  gotoProjectList() {
    this.clearInfos();
    this.router.navigate(['/project_list']);
  }
}
