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
import { ProjetService } from "src/app/service/projet.service";
import { Activity } from "../../../model/activity";
import { ActivityService } from "../../../service/activity.service";
import { CraFormsService } from "../../../service/cra-forms.service";
import { DataSharingService } from "../../../service/data-sharing.service";
import { UtilsService } from "../../../service/utils.service";

import { UploadFileComponent } from "src/app/compo/upload-file/upload-file.component";
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

  @Input()
  myObj: Activity;

  projects: Project[];

  activityTypes: ActivityType[];

  consultants: Consultant[];

  userConnected: Consultant = DataSharingService.userConnected;
  @Input()
  consultantSelected: Consultant;

  @ViewChild("uploadFile", { static: false }) uploadFile: UploadFileComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private craFormsService: CraFormsService,
    private projetService: ProjetService,
    private consultantService: ConsultantService,
    private msgService: MsgService,
    private activityService: ActivityService,
    private activityTypeService: ActivityTypeService
    , public utils: UtilsService
    , protected dataSharingService: DataSharingService
  ) {
    super(utils, dataSharingService);

  }

  ngOnInit() {
    this.initByActivity();
  }

  initByActivity() {
    ////console.log('initByActivity')

    this.getProjets();
    // this.getConsultants();
    this.getActivityTypes();

    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get("isAdd");
    }

    if (this.isForCurentUser == null) {
      this.isForCurentUser = this.route.snapshot.queryParamMap.get(
        "isForCurentUser"
      );
    }

    if (this.isAdd == "true") {
      this.btnSaveTitle = this.utils.tr("Add");
      this.title = this.utils.tr("NewActivity");
      this.myObj = new Activity();
      this.myObj.createdByUsername = this.userConnected.username;
      if (!this.isForMyConsultants()) {
        this.consultantSelected = this.userConnected;
      }
    } else {
      this.btnSaveTitle = this.btnSaveTitle = this.utils.tr("Save");
      this.title = this.btnSaveTitle = this.btnSaveTitle = this.utils.tr("EditActivity");
      let activityP: Activity = this.activityService.getActivity();
      ////console.log('missionP='+missionP);

      if (activityP != null) this.myObj = activityP;
      else if (this.myObj == null) this.myObj = new Activity();
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
  }

  /////////////////

  getProjets() {
    if (this.projects == null) {

      ////////////console.log("getProjets:", this.myObj);
      this.beforeCallServer("getProjets");
      this.projetService.findAll().subscribe(
        (data) => {
          this.afterCallServer("getProjets", data)
          this.projects = data.body.result;
          if (data == undefined) {
            this.projects = new Array();
          }

          if (this.isAdd != "true") {
            let id = this.myObj.project != null ? this.myObj.project.id : -1;
          }
        },
        (error) => {
          this.addErrorFromErrorOfServer("getProjets", error);
          ////console.log(error);
        }
      );
      ////////////console.log("getProjets:END");
    }
  }

  onSelectProject(project: Project) {
    this.myObj.project = project;
    if (this.myObj.project == null) this.myObj.project = new Project();
  }

  @ViewChild('compoSelectProject', { static: false }) compoSelectProject: SelectComponent;
  selectProject(project: Project) {

    this.myObj.project = project;

    var compoSelect: HTMLSelectElement = document.getElementById('project') as HTMLSelectElement;
    if (compoSelect != null) {

      var id = -1
      if (this.projects != null) {
        for (var p of this.projects) {
          id++
          if (p.name == project.name) {
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

          //les consultants ne voient que les conges
          if (this.isConsultant() && this.activityTypes.length > 0) {
            let conges: ActivityType[] = [];
            let j = 0;
            for (let i = 0; i < this.activityTypes.length; i++) {
              if (this.activityTypes[i].congeDay) {
                conges[j++] = this.activityTypes[i];
              }
            }

            this.activityTypes = conges;
          }

          if (this.isAdd != "true") {

          }

        },
        (error) => {
          //console.log(error);
          this.addErrorFromErrorOfServer("getActivityTypes", error);
        }
      );
      ////////////console.log("getProjets:END");

    }
  }

  onSelectActivityType(obj: ActivityType) {
    this.myObj.type = obj;
  }
  @ViewChild('compoSelectActivityType', { static: false }) compoSelectActivityType: SelectComponent;
  selectActivityType(activityType: ActivityType) {

    // this.myObj.activitytype = activitytype;

    var compoSelect: HTMLSelectElement = document.getElementById('activity-type') as HTMLSelectElement;
    // var id = this.activitytypes != null ? this.activitytypes.indexOf(activitytype) : -1
    // console.log('compoSelect', compoSelect)
    if (compoSelect != null) {

      var id = -1
      if (this.activityTypes != null) {
        for (var p of this.activityTypes) {
          id++
          // console.log('p.name', p.name)
          if (p.name == activityType.name) {
            break;
          }
        }
      }

      // console.log('id, activitytype', id, activitytype)

      // id = 0 : est 'Select ActivityType'
      compoSelect.selectedIndex = id + 1;
    }

  }

  isTypeMission(): boolean {
    ////////////console.log("isTypeMission", this.myObj)
    return this.myObj.type.name == "MISSION";
  }

  isTypeInterContrat(): boolean {
    return this.myObj.type.name == "INTER_CONTRACT";
  }

  isTypeFormation(): boolean {
    let ok = false;
    if (this.myObj.type.name != null) ok = this.myObj.type.formaDay;
    return ok;
  }

  isTypeConge(): boolean {
    ////////////console.log("isTypeConge:", this.myObj.type)
    let ok = false;
    if (this.myObj.type.name != null) ok = this.myObj.type.congeDay;

    return ok;
  }

  getActivityLabel() {
    let label = this.utils.tr("Entitled");
    if (this.isTypeMission() || this.isTypeInterContrat())
      label = this.utils.tr("Entitled");
    else if (this.isTypeFormation())
      label = this.utils.tr("Entitled");
    return label;
  }

  isActivityLabelVisible() {
    return (
      this.isTypeMission() ||
      this.isTypeInterContrat() ||
      this.isTypeFormation()
    );
  }

  isActivityValidVisible() {
    return !this.isConsultant();
  }

  gotoActivityList() {
    this.clearInfos();
    this.router.navigate(["/activity_app"]);
  }

  /////////////
  onSubmit() {
    //////////
    console.log("onSubmit: myObj", this.myObj);
    if (!this.myObj.name) {
      this.myObj.name = this.myObj.type.name;
    }

    if (!this.isForMyConsultants()) {
      this.myObj.consultant = this.consultantSelected;
    }

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
    msg.msg = "New Activity : " + this.myObj.type.name;
    msg.type = "Activity";
    msg.typeId = this.myObj.id;
    msg.from = this.userConnected;
    msg.to = this.userConnected.adminConsultant;
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
    this.myObj.dateFin = date;
    this.errorDates = error;
    this.utils.showNotification(
      "error",
      "The end date of project you have been above of the start date !"
    );
  }

  isForMyConsultants() {
    ////////////console.log("isForMyConsultants isForCurentUser="+this.isForCurentUser);
    let ok = this.isForCurentUser != "true";
    ////////////console.log("ok="+ok);
    return ok;
  }

  isConsultant(): boolean {
    return this.dataSharingService.isConsultant();
  }
}
