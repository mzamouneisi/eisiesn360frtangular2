import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivityType } from 'src/app/model/activityType';
import { Project } from 'src/app/model/project';
import { ActivityTypeService } from 'src/app/service/activityType.service';
import { ProjectService } from 'src/app/service/project.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Activity } from '../../../model/activity';
import { Consultant } from "../../../model/consultant";
import { ActivityService } from '../../../service/activity.service';
import { DataSharingService } from "../../../service/data-sharing.service";
import { MereComponent } from '../../_utils/mere-component';
import { ActivityFormComponent } from '../activity-form/activity-form.component';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent extends MereComponent {

  myList: Activity[];
  myObj: Activity;
  /** le consultant des activites */
  @Input() consultant: Consultant;

  @Input() isAll = false;

  projects: Project[];

  activityTypes: ActivityType[];

  @ViewChild('myObjEditView', { static: false }) myObjEditView: ActivityFormComponent;

  userConnected: Consultant

  constructor(
    private activityService: ActivityService
    , private activityTypeService: ActivityTypeService
    , private projectService: ProjectService
    , protected router: Router
    , public utils: UtilsService
    , protected utilsIhm: UtilsIhmService
    , protected modal: NgbModal
    , public dataSharingService: DataSharingService
  ) {
    super(utils, dataSharingService);

    this.userConnected = dataSharingService.userConnected

    this.colsSearch = ["name", "type", "project", "dateDeb", "dateFin", "consultant", "valid"]
  }

  ngOnInit() {
    console.log("ngOnInit DEB ")
    this.findAll();
    if (this.myObjEditView != null) {
      this.myObjEditView.myObj = null;
    }

    // console.log("+++++++++++++++++ ngOninit : consultant : ", this.consultant)
    this.dataSharingService.userSelectedActivity = this.consultant

    this.getProjects();
    // this.getConsultants();
    this.getActivityTypes();

  }

  getTitle() {
    let t = "";
    let nbElement = 0;
    if (this.myList != null) nbElement = this.myList.length;
    //List Activity
    if (this.isConsultant()) t = this.utils.tr("ListAbsence");
    else t = this.utils.tr("ListActivites");

    t = t + " (" + nbElement + ")"

    if (this.consultant != null) t += " : " + this.consultant.fullName;

    return t
  }

  findAll() {
    console.log("findAll Activity DEB : ", this.myList)
    let idConsultant = -1;
    if (this.consultant != null) idConsultant = this.consultant.id;

    if (idConsultant < 0 && this.isAll == false) {
      this.myList = [];
      return;
    }

    if (this.isAll == true) {
      idConsultant = 0;
    }

    // //////////console.log("findAll idConsultant="+idConsultant)

    this.beforeCallServer("findAll");
    this.activityService.findAllByConsultant(idConsultant).subscribe(
      data => {
        this.afterCallServer("findAll", data)
        ////console.log(data)
        if (data.body != null) {
          this.myList = data.body.result;
          this.myList00 = this.myList;
          console.log("findAll Activity : ", this.myList)
        }
        console.log("findAll myList : ", this.myList);
      }, error => {
        ////console.log(error);
        this.addErrorFromErrorOfServer("findAll", error);
      }
    );
  }

  setMyList(list: any[]) {
    this.myList = list;
  }

  edit(activity: Activity) {
    this.clearInfos();
    let isGetType = false
    let isGetProject = false
    if (activity.type == null) {
      this.activityTypeService.findById(activity.typeId).subscribe(
        data => {
          console.log("edit activityTypeService.findById : id, data : ",activity.typeId, data)
          activity.type = data.body.result;
          isGetType = true
        }, error => {
          isGetType = true
          console.log(error);
        });
    }

    if (activity.project == null) {
      this.projectService.findById(activity.projectId).subscribe(
        data => {
          console.log("edit projectService.findById : id, data : ",activity.projectId, data)
          activity.project = data.body.result;
          isGetProject = true
        }, error => {
          isGetProject = true
          console.log(error);
        });
    }

    var n = 0, nMax= 5
    var x = setInterval(
      () => {
        if(! isGetProject  && ! isGetType && n<nMax) {
          n++
          this.activityService.setActivity(activity);
          this.router.navigate(['/activity_form']);
        }else {
          clearInterval(x);
          x=null
        }
      }, 3000
    )
  }

  showForm(myObj: Activity) {

    var n = 0, nMax= 5

    var x = setInterval(
      () => {
        if((!myObj.type || !myObj.project) && n<nMax ) {
          n++;
          this.showFormPure(myObj)
        }else {
          clearInterval(x);
          x=null
        }
      }, 2000
    )

  }

  showForm2(myObj: Activity) {

    this.showFormPure(myObj)

    var n = 0, nMax= 1

    var x = setInterval(
      () => {
        if(n<nMax ) {
          n++;
          this.showFormPure(myObj)
        }else {
          clearInterval(x);
          x=null
        }
      }, 2000
    )

  }

  showFormPure(myObj: Activity) {
    this.myObj = myObj;
    console.log("showFormPure", myObj)
    if (this.myObjEditView != null) {
      this.myObjEditView.myObj = this.myObj
      this.myObjEditView.isAdd = 'false';
      this.myObjEditView.activityTypes = this.activityTypes
      this.myObjEditView.projects = this.projects

      this.myObjEditView.ngOnInit()

      this.myObjEditView.selectProject(myObj.project)

      this.myObjEditView.selectActivityType(myObj.type)
    }

  }



  delete(myObj) {
    let myThis = this;
    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, this
      , () => {
        myThis.beforeCallServer("delete")
        myThis.activityService.deleteById(myObj.id)
          .subscribe(
            data => {
              myThis.afterCallServer("delete", data)
              if (!myThis.isError()) {
                myThis.findAll();
                myThis.myObj = null;
              }
            }, error => {
              myThis.addErrorFromErrorOfServer("delete", error);
              ////console.log(error);
            }
          );
      }
      , null
    );

  }

  getIdOfCurentObj() {
    return this.myObj != null ? this.myObj.id : -1;
  }

  isConsultantCurrentUser(): boolean {
    let idConsultant = -1;
    if (this.consultant != null) idConsultant = this.consultant.id;

    let id = this.userConnected.id;

    return id == idConsultant;

  }

  addActivity() {

    // this.dataSharingService.activityTypes = this.activityTypes
    // this.dataSharingService.projects = this.projects

    let isForCurentUser = 'false';
    if (this.isConsultantCurrentUser()) {
      isForCurentUser = 'true';
    }

    this.clearInfos();
    this.router.navigate(['/activity_form'], { queryParams: { 'isAdd': 'true', 'isForCurentUser': isForCurentUser } });
  }

  /****
   * This method invoked when i need to show the modal rejected cra
   */
  openModalPopup(templateRef: TemplateRef<any>) {
    this.modal.open(templateRef, { size: 'lg' });
  }

  getProjects() {
    if (this.projects == null) {

      ////////////console.log("getProjects:", this.myObj);
      this.beforeCallServer("getProjects");
      this.projectService.findAll(this.getEsnId()).subscribe(
        (data) => {
          this.afterCallServer("getProjects", data)
          this.projects = data.body.result;
          this.dataSharingService.projects = this.projects
          console.log("getProjects:", this.projects);
          if (data == undefined) {
            this.projects = new Array();
          }
        },
        (error) => {
          this.addErrorFromErrorOfServer("getProjects", error);
          ////console.log(error);
        }
      );
      ////////////console.log("getProjects:END");
    }
  }

  private getActivityTypes() {
    if (this.activityTypes == null) {

      ////////////console.log("getActivityTypes:");
      this.beforeCallServer("getActivityTypes");

      this.activityTypeService.findAll(this.getEsnId()).subscribe(
        (data) => {
          this.afterCallServer("getActivityTypes", data)
          ////console.log(data);
          this.activityTypes = data.body.result;
          this.dataSharingService.activityTypes = this.activityTypes
          console.log("getActivityTypes:", this.activityTypes);
          if (data == undefined) {
            this.activityTypes = new Array();
          }
        },
        (error) => {
          //console.log(error);
          this.addErrorFromErrorOfServer("getActivityTypes", error);
        }
      );
      ////////////console.log("getProjects:END");

    }
  }


}
