import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Activity } from '../../../model/activity';
import { Consultant } from "../../../model/consultant";
import { ActivityService } from '../../../service/activity.service';
import { ConsultantService } from "../../../service/consultant.service";
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

  @ViewChild('myObjEditView', {static: false}) myObjEditView: ActivityFormComponent;

  userConnected: Consultant = DataSharingService.userConnected;

  constructor(
    private activityService: ActivityService
    , private consultantService: ConsultantService
    , protected router: Router
    , public utils: UtilsService
    , protected utilsIhm: UtilsIhmService
    , protected modal: NgbModal
    , protected dataSharingService: DataSharingService
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit() {
    this.findAll();
    if (this.myObjEditView != null) {
      this.myObjEditView.myObj = null;
    }

    // console.log("+++++++++++++++++ ngOninit : consultant : ", this.consultant)
    this.dataSharingService.userSelectedActivity = this.consultant
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
        }
        ////console.log(this.myList);
      }, error => {
        ////console.log(error);
        this.addErrorFromErrorOfServer("findAll", error);
      }
    );
  }

  setMyList(list : any[]) {
    this.myList = list;
  }

  edit(activity: Activity) {
    this.clearInfos();
    this.activityService.setActivity(activity);
    this.router.navigate(['/activity_form']);
  }

  delete(myObj) {
    let myThis = this;
    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, this
		, ()=> {
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

  showForm(myObj: Activity) {
    this.myObj = myObj;
    if (this.myObjEditView != null) {
      this.myObjEditView.myObj = this.myObj
      this.myObjEditView.isAdd = 'false';
      this.myObjEditView.ngOnInit()

      this.myObjEditView.selectProject(myObj.project)

      this.myObjEditView.selectActivityType(myObj.type)
    }
  }

  isConsultant(): boolean {
    return this.dataSharingService.isConsultant();
  }

  isConsultantCurrentUser(): boolean {
    let idConsultant = -1;
    if (this.consultant != null) idConsultant = this.consultant.id;

    let id = this.userConnected.id;

    return id == idConsultant;

  }

  gotoActivityForm() {
    let isForCurentUser = 'false';
    if (this.isConsultantCurrentUser()) {
      isForCurentUser = 'true';
    }

    this.clearInfos();
    this.router.navigate(['/activity_form'], {queryParams: {'isAdd': 'true', 'isForCurentUser': isForCurentUser}});
  }

  /****
   * This method invoked when i need to show the modal rejected cra
   */
  openModalPopup(templateRef: TemplateRef<any>) {
    this.modal.open(templateRef, {size: 'lg'});
  }

}
