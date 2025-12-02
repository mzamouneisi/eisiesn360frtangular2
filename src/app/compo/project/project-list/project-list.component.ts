import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DataSharingService } from 'src/app/service/data-sharing.service';
import { ProjectService } from 'src/app/service/project.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Project } from '../../../model/project';
import { MereComponent } from '../../_utils/mere-component';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent extends MereComponent {

  title: string = "";

  myList: Project[];
  myObj: Project;
  @ViewChild('myObjEditView', { static: false }) myObjEditView: ProjectFormComponent;

  constructor(private projectService: ProjectService, private router: Router
    , public utils: UtilsService
    , protected utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService);

    this.colsSearch = ["name", "description", "teamNumber", "teamDesc", "method", "client"]
  }

  ngOnInit() {
    this.findAll();
  }

  getTitle() {
    let nbElement = 0
    if (this.myList != null) nbElement = this.myList.length
    this.title = this.utils.tr("List") + " " + this.utils.tr("Project") + " (" + nbElement + ")"
    return this.title
  }

  getIdOfCurentObj() {
    return this.myObj != null ? this.myObj.id : -1;
  }
  showForm(myObj: Project) {
    this.myObj = myObj;
    if (this.myObjEditView != null) {
      this.myObjEditView.myObj = this.myObj
      this.myObjEditView.isAdd = 'false';
      this.myObjEditView.ngOnInit()
    }
  }


  findAll() {
    this.beforeCallServer("findAll")
    this.projectService.findAll(this.getEsnId()).subscribe(
      data => {
        this.afterCallServer("findAll", data)
        this.myList = data.body.result;
        this.dataSharingService.majClientInProjectList(this.myList);
        setTimeout(
          () => {
            this.myList00 = this.myList;
          }, 5000
        )
        console.log("findAll : myList : ", this.myList);
      }, error => {
        this.addErrorFromErrorOfServer("findAll", error);
        ////console.log(error);
      }
    );
  }

  setMyList(myList: any[]) {
    this.myList = myList;
  }

  edit(project: Project) {
    this.clearInfos();
    this.projectService.setProject(project);
    this.router.navigate(['/project_form']);
  }

  delete(myObj) {
    let mythis = this;
    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, mythis
      , () => {
        mythis.beforeCallServer("delete")
        mythis.projectService.deleteById(myObj.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data)
              if (!mythis.isError()) {
                mythis.findAll();
                mythis.myObj = null;
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
}
