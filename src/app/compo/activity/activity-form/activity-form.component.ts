import {
  Component,
  Input,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ActivityType } from "src/app/model/activityType";
import { Consultant } from "src/app/model/consultant";
import { Msg } from "src/app/model/msg";
import { Project } from "src/app/model/project";
import { ActivityTypeService } from "src/app/service/activityType.service";
import { ConsultantService } from "src/app/service/consultant.service";
import { MsgService } from "src/app/service/msg.service";
import { Activity } from "../../../model/activity";
import { ActivityService } from "../../../service/activity.service";
import { CraFormsService } from "../../../service/cra-forms.service";
import { DataSharingService } from "../../../service/data-sharing.service";
import { UtilsService } from "../../../service/utils.service";

import { UploadFileComponent } from "src/app/compo/upload-file/upload-file.component";
import { ProjectService } from "src/app/service/project.service";
import { SelectComponent } from "../../_reuse/select-consultant/select/select.component";
import { MereComponent } from "../../_utils/mere-component";

@Component({
  selector: "app-activity-form",
  templateUrl: "./activity-form.component.html",
  styleUrls: ["./activity-form.component.css"],
})
export class ActivityFormComponent extends MereComponent {
  title: string;
  btnSaveTitle: string;
  isAdd: string;
  isForCurentUser: string;
  isViewListProject = false
  isTypeMission = false
  isTypeInterContrat = false
  isTypeFormation = false
  isActivityLabelVisible = false
  isTypeConge = false


  @Input()
  myObj: Activity;

  @Input()
  projects: Project[];

  @Input()
  activityTypes: ActivityType[];

  consultants: Consultant[];

  userConnected: Consultant
  @Input()
  consultantSelected: Consultant;

  @ViewChild("uploadFile", { static: false }) uploadFile: UploadFileComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private craFormsService: CraFormsService,
    private projectService: ProjectService,
    private activityService: ActivityService,
    private consultantService: ConsultantService,
    private msgService: MsgService,
    private activityTypeService: ActivityTypeService
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
  ) {
    super(utils, dataSharingService);
    this.userConnected = dataSharingService.userConnected
  }

  ngOnInit() {
    this.initByActivity();
  }

  initByActivity() {
    console.log('myObj DEB', this.myObj);

    this.projects = this.dataSharingService.projects
    this.activityTypes = this.dataSharingService.activityTypes

    this.getProjects();
    // this.getConsultants();
    this.getActivityTypes();

    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get("isAdd");
    }

    console.log("initByActivity isAdd=", this.isAdd);

    if (this.isForCurentUser == null) {
      this.isForCurentUser = this.route.snapshot.queryParamMap.get(
        "isForCurentUser"
      );
    }

    if (this.isAdd == "true") {
      this.btnSaveTitle = this.utils.tr("Add");
      this.title = this.utils.tr("NewActivity");
      this.myObj = new Activity();
      this.myObj.valid = true
      this.myObj.createdByUsername = this.userConnected.username;
      if (!this.isForMyConsultants()) {
        this.consultantSelected = this.userConnected;
      }
    } else {
      this.btnSaveTitle = this.btnSaveTitle = this.utils.tr("Save");
      this.title = this.btnSaveTitle = this.btnSaveTitle = this.utils.tr("EditActivity");
      let activityP: Activity = this.activityService.getActivity();

      console.log('activityP=', activityP);
      console.log('myObj=', this.myObj);

      if (activityP != null && this.myObj == null) this.myObj = activityP;
      else if (this.myObj == null) {
        this.myObj = new Activity();
        this.myObj.valid = true
      }

      this.activityTypeService.majActivity(this.myObj)
      this.consultantService.majActivity(this.myObj)
      this.projectService.majActivity(this.myObj)

    }

    if (this.uploadFile != null) {
      this.uploadFile.ngOnInit();
    }

    if (this.consultantSelected == null) {
      this.consultantSelected = this.dataSharingService.userSelectedActivity;
    }

    if (this.consultantSelected == null) {
      this.consultantSelected = this.userConnected;
    }
    this.myObj.consultant = this.consultantSelected

    this.onSelectActivityType(this.myObj.type)

    this.isActivityLabelVisibleFct()

    console.log('activityTypes ', this.activityTypes);
    console.log('projects ', this.projects);

    console.log('myObj FIN', this.myObj);

  }

  /////////////////

  getProjects() {
    console.log("getProjects:", this.projects);
    if (this.projects == null) {

      ////////////console.log("getProjects:", this.myObj);
      this.beforeCallServer("getProjects");
      this.projectService.findAll(this.getEsnId()).subscribe(
        (data) => {
          this.afterCallServer("getProjects", data)
          // this.projects = data.body.result;
          this.projects = data.body.result;
          if (data == undefined) {
            this.projects = new Array();
          }

          if (this.isAdd != "true") {
            let id = this.myObj.project != null ? this.myObj.project.id : -1;
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

  onSelectProject(project: Project) {
    this.myObj.project = project;
    if (this.myObj.project == null) {
      this.myObj.project = new Project();
    } else {
      console.log("project : ", project)
      let cli = this.myObj.project.client
      console.log("cli : ", cli)
      if (!cli) {
        // this.myObj.name = this.myObj.type.name + ' / ' + cli.name
        this.dataSharingService.majClientInProject(project,
          () => {
            this.myObj.name = project.client.name + ' || ' + this.myObj.type?.name + ' ' + project.name
          }
        )
      }
    }

  }

  @ViewChild('compoSelectProject', { static: false }) compoSelectProject: SelectComponent;
  selectProject(project: Project) {

    this.myObj.project = project;
    var compoSelect: HTMLSelectElement = document.getElementById('project') as HTMLSelectElement;

    if (project == null) {
      if (this.compoSelectProject != null) this.compoSelectProject.selectedObj = null
      if (compoSelect != null) compoSelect.selectedIndex = -1
      return
    }

    if (compoSelect != null) {

      var id = -1
      if (this.projects != null) {
        for (var p of this.projects) {
          id++
          if (p != null && project && p.name == project.name) {
            break;
          }
        }
      }
      // id = 0 : est 'Select Project'
      compoSelect.selectedIndex = id + 1;
    }

  }

  //////////////////

  // getConsultants() {
  //   console.log("+++++++++++++++++++getConsultants: myObj : ", this.myObj);
  //   this.beforeCallServer("getConsultants");
  //   this.consultantService.findNotAdminConsultant().subscribe(
  //     (data) => {
  //       this.afterCallServer("getConsultants", data)
  //       this.consultants = data.body.result;
  //       if (data == undefined) {
  //         this.consultants = new Array();
  //       }
  //       if (this.isAdd != "true") {
  //       }

  //     },
  //     (error) => {
  //       this.addErrorFromErrorOfServer("getConsultants", error);
  //       ////console.log(error);
  //     }
  //   );
  //   ////////////console.log("getConsultants:END");
  // }

  // onSelectConsultant(consultant: Consultant) {
  //   this.myObj.consultant = consultant;
  //   if (this.myObj.consultant == null) this.myObj.consultant = new Consultant();
  //   this.consultantSelected = this.myObj.consultant;
  // }

  // @ViewChild('compoSelectConsultant', {static:false}) compoSelectConsultant:SelectComponent ;
  // selectConsultant(consultant:Consultant){
  //     this.compoSelectConsultant.selectedObj = consultant;
  // }  

  /////////////////////////////////
  /***
   * used to initialize the component activity types
   */
  private getActivityTypes() {
    console.log("getActivityTypes:", this.activityTypes);
    if (this.activityTypes == null) {

      ////////////console.log("getActivityTypes:");
      this.beforeCallServer("getActivityTypes");

      this.activityTypeService.findAll(this.getEsnId()).subscribe(
        (data) => {
          this.afterCallServer("getActivityTypes", data)
          ////console.log(data);
          this.activityTypes = data.body.result;
          ////console.log(this.activityTypes);
          if (data == undefined) {
            this.activityTypes = new Array();
          }

          // //les consultants ne voient que les conges
          // if (this.isConsultant() && this.activityTypes.length > 0) {
          //   let conges: ActivityType[] = [];
          //   let j = 0;
          //   for (let i = 0; i < this.activityTypes.length; i++) {
          //     if (this.activityTypes[i].congeDay) {
          //       conges[j++] = this.activityTypes[i];
          //     }
          //   }

          //   this.activityTypes = conges;
          // }

          // if (this.isAdd != "true") {

          // }

        },
        (error) => {
          //console.log(error);
          this.addErrorFromErrorOfServer("getActivityTypes", error);
        }
      );
      ////////////console.log("getProjects:END");

    }
  }

  onSelectActivityType(obj: ActivityType) {
    console.log("onSelectActivityType this.myObj, this.myObj.type, obj ", this.myObj, this.myObj.type, obj)
    try {
      this.myObj.type = obj;
    } catch (error) {
      // console.log(error)
    }

    this.isViewListProject = false
    this.isTypeMission = false
    this.isTypeInterContrat = false

    this.isTypeFormationFct()
    this.isTypeCongeFct()

    if (obj == null) {
      return
    }

    if (obj.name == "MISSION") {
      this.isTypeMission = true
    } else if (obj.name == "INTER_CONTRAT") {
      this.isTypeInterContrat = true
    }

    let listHorsProject = ["INTER_CONTRAT", "FORMATION_INT"]
    this.isViewListProject = !listHorsProject.includes(obj.name)

    this.isActivityLabelVisibleFct()

  }
  @ViewChild('compoSelectActivityType', { static: false }) compoSelectActivityType: SelectComponent;
  selectActivityType(activityType: ActivityType) {

    // this.myObj.activitytype = activitytype;

    var compoSelect: HTMLSelectElement = document.getElementById(this.compoSelectActivityType.selectId) as HTMLSelectElement;
    // var id = this.activitytypes != null ? this.activitytypes.indexOf(activitytype) : -1
    // console.log('compoSelect', compoSelect)

    if (activityType == null) {
      if (this.compoSelectActivityType != null) this.compoSelectActivityType.selectedObj = null
      if (compoSelect != null) compoSelect.selectedIndex = -1
      return
    }

    if (compoSelect != null) {

      var id = -1
      if (this.activityTypes != null) {
        for (var p of this.activityTypes) {
          id++
          // console.log('p.name', p.name)
          if (p != null && activityType != null && p.name == activityType.name) {
            break;
          }
        }
      }

      // var id = this.activityTypes != null ? this.activityTypes.indexOf(activityType) : -1

      this.compoSelectActivityType.selectedObj = activityType;

      // console.log('id, activitytype', id, activitytype)

      // id = 0 : est 'Select ActivityType'
      compoSelect.selectedIndex = id + 1;
    }

  }

  isTypeFormationFct(): boolean {
    let ok = false;
    if (this.myObj.type && this.myObj.type.name != null) ok = this.myObj.type.formaDay;
    this.isTypeFormation = ok
    return ok;
  }

  isTypeCongeFct(): boolean {
    ////////////console.log("isTypeConge:", this.myObj.type)
    let ok = false;
    if (this.myObj.type && this.myObj.type.name != null) ok = this.myObj.type.congeDay;
    this.isTypeConge = ok

    return ok;
  }

  isActivityLabelVisibleFct() {
    this.isActivityLabelVisible = (
      this.isTypeMission ||
      this.isTypeInterContrat ||
      this.isTypeFormation
    );
  }

  isActivityValidVisible() {
    return !this.isConsultant();
  }

  getActivityLabel() {
    let label = this.utils.tr("Entitled");
    if (this.isTypeMission || this.isTypeInterContrat)
      label = this.utils.tr("Entitled");
    else if (this.isTypeFormation)
      label = this.utils.tr("Entitled");
    return label;
  }

  gotoActivityList() {
    this.clearInfos();
    this.router.navigate(["/activity_app"]);
  }

  /////////////
  onSubmit() {
    //////////
    console.log("onSubmit: myObj", this.myObj);
    if (!this.myObj.name && this.myObj.type) {
      this.myObj.name = this.myObj.type.name;
    }

    if (!this.isForMyConsultants()) {
      this.myObj.consultant = this.consultantSelected;
      this.myObj.consultantId = this.consultantSelected?.id;
    }

    console.log("onSubmit ", this.myObj)

    this.beforeCallServer("onSubmit");
    this.activityService.save(this.myObj).subscribe(
      (data) => {
        this.afterCallServer("onSubmit", data)
        this.sendMsgToManager();

        if (!this.getError()) this.gotoActivityList();
      },
      (error) => {
        this.addErrorFromErrorOfServer("onSubmit", error);
        ;
      }
    );
  }

  /**
   *
   */
  sendMsgToManager() {
    let msg: Msg = new Msg();
    msg.dateMsg = new Date();
    msg.msg = "New Activity : " + this.myObj.type?.name;
    msg.type = "Activity";
    msg.typeId = this.myObj.id;
    msg.from = this.userConnected;
    msg.to = this.userConnected.adminConsultant
    msg.isReadByTo = false;

    //////////console.log("sendMsgToManager", msg);

    this.beforeCallServer("sendMsgToManager")
    this.msgService.save(msg).subscribe(
      (data) => {
        ////////////console.log("data:"+data);
        this.afterCallServer("sendMsgToManager", data)
        ////////////console.log("error:", this.error );

        if (!this.isError()) this.gotoActivityList();
      },
      (error) => {
        this.addErrorFromErrorOfServer("sendMsgToManager", error);
        ;
      }
    );
  }


  errorDates = "";
  onStartDateChanged(date: Date, error: string) {
    console.log("onStartDateChanged date ", date)
    this.myObj.dateDeb = date;
    this.errorDates = error;
    if (error) {
      this.utils.showNotification(
        "error",
        "The end date of project you have been above of the start date !"
      );
    }
  }

  onEndDateChanged(date: Date, error: string) {
    console.log("onEndDateChanged date ", date)
    this.myObj.dateFin = date;
    this.errorDates = error;
    this.utils.showNotification(
      "error",
      "The end date of project you have been above of the start date !"
    );
  }

  ///////////////
  // onChangeDateDeb(event: any): void {
  //   this.myObj.dateDeb = event.value;
  // }
  // onChangeDateFin(event: any): void {
  //   this.myObj.dateFin = event.value;
  // }

  onChangeDateDebFin(): void {
    let { dateDeb, dateFin } = this.myObj;

    // Si dateDeb est null -> initialiser
    if (!dateDeb) {
      dateDeb = dateFin ? this.makePureDate(dateFin) : new Date();
    }

    // Si dateFin est null -> dateDeb + 3 mois
    if (!dateFin) {
      dateFin = this.addMonthsToDate2(dateDeb, 3);
    }

    // Si dateFin < dateDeb -> recalculer fin
    if (dateFin < dateDeb) {
      dateFin = this.addMonthsToDate2(dateDeb, 3);
    }

    this.myObj.dateDeb = new Date(dateDeb);
    this.myObj.dateFin = new Date(dateFin);

    console.log(' Date Deb:', this.myObj.dateDeb);
    console.log(' Date Fin:', this.myObj.dateFin);

    this.myObj.dateDeb = new Date(this.myObj.dateDeb);
    this.myObj.dateFin = new Date(this.myObj.dateFin);

    console.log('Final Date Deb:', this.myObj.dateDeb);
    console.log('Final Date Fin:', this.myObj.dateFin);
  }

  // private addMonthsToDate2(date: Date, nbMonth: number): Date {
  //   const clone = new Date(date);
  //   clone.setMonth(clone.getMonth() + nbMonth);
  //   return this.makePureDate(clone);
  // }

  private addMonthsToDate2(date: Date, nbMonth: number): Date {
  const newDate = new Date(date.getFullYear(), date.getMonth() + nbMonth, date.getDate());
  return newDate;
}


  private makePureDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }


  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }


  ///////////////

  isForMyConsultants() {
    ////////////console.log("isForMyConsultants isForCurentUser="+this.isForCurentUser);
    let ok = this.isForCurentUser != "true";
    ////////////console.log("ok="+ok);
    return ok;
  }

}
