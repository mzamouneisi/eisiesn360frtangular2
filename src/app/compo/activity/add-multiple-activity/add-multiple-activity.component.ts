import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProjectService } from 'src/app/service/project.service';
import { Activity } from "../../../model/activity";
import { ActivityOverTime } from "../../../model/activity-over-time";
import { ActivityType } from "../../../model/activityType";
import { Consultant } from "../../../model/consultant";
import { Project } from "../../../model/project";
import { ActivityService } from "../../../service/activity.service";
import { ActivityTypeService } from "../../../service/activityType.service";
import { ConsultantService } from "../../../service/consultant.service";
import { CraFormsService } from "../../../service/cra-forms.service";
import { DataSharingService } from "../../../service/data-sharing.service";
import { UtilsService } from "../../../service/utils.service";
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';
import { ActivityListComponent } from "../activity-list/activity-list.component";

@Component({
  selector: 'app-add-multiple-activity',
  templateUrl: './add-multiple-activity.component.html',
  styleUrls: ['./add-multiple-activity.component.css']
})
export class AddMultipleActivityComponent extends MereComponent {

  @ViewChild('addMultipleActivityView', {static: true}) addMultipleActivityView: TemplateRef<any>;
  activities: Activity[] = new Array();

  projects: Project[];
  activityTypes: ActivityType[];
  consultants: Consultant[];
  consultantsOthers: Consultant[];
  myObj: Activity = new Activity();
  activityOverTime: ActivityOverTime = new ActivityOverTime();

  constructor(private route: ActivatedRoute
    , private router: Router
    , private craFormsService: CraFormsService
    , private projectService: ProjectService
    , private consultantService: ConsultantService
    , private activityService: ActivityService
    , private activityTypeService: ActivityTypeService
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
    , private modal: NgbModal) {
      super(utils, dataSharingService);
  }

  ngOnInit() {
    this.getProjects();
    this.getConsultants();
    this.getActivityTypes();
  }

  getProjects() {
    this.beforeCallServer("getProjects");
    this.projectService.findAll(this.getEsnId()).subscribe(
      data => {
        this.afterCallServer("getProjects", data)
        this.projects = data.body.result;
        if (data == undefined) {
          this.projects = new Array();
        }

      }, error => {
        this.addErrorFromErrorOfServer("getProjects", error);
      }
    );
  }
  
  onSelectProject(project: Project) {
    this.myObj.project = project;
    // if (this.myObj.project == null) this.myObj.project = new Project();
  }  
  @ViewChild('compoSelectProject', {static:false}) compoSelectProject:SelectComponent ;
  selectProject(project:Project){
      this.compoSelectProject.selectedObj = project;
  }  

  getConsultants() {

    this.beforeCallServer("getConsultants");
    this.consultantService.findNotAdminConsultant().subscribe(
      data => {
        this.afterCallServer("getConsultants", data)
        if (data == undefined) {
          this.consultants = new Array();
        }

        this.consultants = data.body.result;
        this.consultantsOthers = []
        for(let c of this.consultants) {
          if(c.id != this.userConnected.id) {
            this.consultantsOthers.push(c)
          }
        }

      }, error => {
        this.addErrorFromErrorOfServer("getConsultants", error);
      }
    );
  }

  onSelectConsultant(consultant: Consultant) {
    this.myObj.consultant = consultant;
  }
  @ViewChild('compoSelectConsultant', {static:false}) compoSelectConsultant:SelectComponent ;
  selectConsultant(consultant:Consultant){
      this.compoSelectConsultant.selectedObj = consultant;
  }

  /***
   * used to initialize the component activity types
   */
  private getActivityTypes() {
    ////////////console.log("getActivityTypes:");
    this.beforeCallServer("getActivityTypes");
    this.activityTypeService.findAll(this.getEsnId()).subscribe(
      data => {
        this.afterCallServer("getActivityTypes", data)
        ////console.log(data);
        this.activityTypes = data.body.result;
        ////console.log(this.activityTypes);
        if (data == undefined) {
          this.activityTypes = new Array();
        }

      }, error => {
        //console.log(error);
        this.addErrorFromErrorOfServer("getActivityTypes", error);
      }
    );
  }

  onSelectActivityType(activityType: ActivityType) {
    this.myObj.type = activityType;
  }
  @ViewChild('compoSelectActivityType', {static:false}) compoSelectActivityType:SelectComponent ;
  selectActivityType(activityType:ActivityType){
      this.compoSelectActivityType.selectedObj = activityType;
  }

  errorDates="";
  onStartDateChanged(date: Date, error: string) {
    this.myObj.dateDeb=date;
    this.errorDates=error;
    ////////////console.log("main onChangeDateFin myDatePickerFin", date, error);
  }

  onEndDateChanged(date: Date, error: string) {
    this.myObj.dateFin=date;
    this.errorDates=error;
    ////////////console.log("main onChangeDateFin myDatePickerFin", date, error);
    if(this.errorDates) {
      this.utils.showNotification("error", "The end date of project you have been above of the start date !")
    }
  }

  isTypeMission(): boolean {
    ////////////console.log("isTypeMission", this.myObj)
    return this.myObj.type.name == 'MISSION';
  }

  isTypeInterContrat(): boolean {
    return this.myObj.type.name == 'INTER_CONTRAT';
  }

  getActivityLabel() {
    let label = this.utils.tr('Entitled');
    if (this.isTypeMission() || this.isTypeInterContrat()) label =  this.utils.tr('Entitled');
    else if (this.isTypeFormation()) label =  this.utils.tr('Entitled');
    return label
  }

  isTypeFormation(): boolean {
    let ok = false
    if (this.myObj.type.name != null)
      ok = this.myObj.type.formaDay;
    return ok
  }

  removeItem(index: number) {
    this.activities.splice(index, 1)
  }

  push() {

    this.activities.push(this.myObj);
    this.activities.sort((a, b) => a.dateDeb.getTime() - b.dateFin.getTime());
    this.myObj = new Activity();
    //TODO a remplacer par ???
    // this.consultantForm.reset();
    // this.activityTypeForm.reset();
    // this.projectForm.reset();
  }

  update() {
    let currentUser: Consultant = this.dataSharingService.userConnected;
    this.activities.forEach(activity => {
      activity.createdByUsername = currentUser.username;
    });
    this.beforeCallServer("update")
    this.activityService.addMultipleActivity(this.activities).subscribe((data) => {
      this.afterCallServer("update", data)
      //activityListComponent.getFilteredActivity();
    }, (error) => {
      this.addErrorFromErrorOfServer("update", error);
    })
    this.activities = new Array();
    this.modal.dismissAll(this.addMultipleActivityView);
    let activityListComponent: ActivityListComponent = this.dataSharingService.getService(ActivityListComponent.name);

  }

  addActivityOverTime() {
    let targetExist: boolean = false;
    this.myObj.activityOverTimes.forEach(value => {
      if (value.target == this.activityOverTime.target) {
        targetExist = true;
      }
    })
    if (!targetExist) {
      this.myObj.activityOverTimes.push(this.activityOverTime)
    } else {
      this.utils.showNotification("error", this.activityOverTime.target+" deja exist")
    }
    this.activityOverTime = new ActivityOverTime();
  }

  deleteActivityOverTime(index: number) {
    this.myObj.activityOverTimes.splice(index, 1)
  }

  isOverTime() {
    if (!this.myObj.overTime) {
      this.myObj.activityOverTimes = [];
    }
  }


}
