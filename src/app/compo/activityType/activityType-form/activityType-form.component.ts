import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataSharingService } from 'src/app/service/data-sharing.service';
import { EsnService } from 'src/app/service/esn.service';
import { UtilsService } from 'src/app/service/utils.service';
import { ActivityType } from '../../../model/activityType';
import { ActivityTypeService } from '../../../service/activityType.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-activityType-form',
  templateUrl: './activityType-form.component.html',
  styleUrls: ['./activityType-form.component.css']
})
export class ActivityTypeFormComponent extends MereComponent {

  title: string;
  btnSaveTitle: string;
  isAdd: string;

  @Input()
  myObj: ActivityType;

  @ViewChild('nameHtml', {static: false}) nameHtml: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router, private activityTypeService: ActivityTypeService
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
    , private esnService : EsnService
    ) {
      super(utils, dataSharingService);
  }

  ngOnInit() {
    // this.dataSharingService.addEsnInConsultant(this.userConnected)
    this.initByActivityType();
    this.setFocusName();
  }

  setFocusName(): void {
    if (this.nameHtml && this.nameHtml.nativeElement) {
      //console.log('focus')
      this.nameHtml.nativeElement.focus();
    }
  }

  initByActivityType() {

    ////console.log('initByActivityType')

    if (this.isAdd == null) {
      //////////console.log("isAdd null")
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }

    if (this.isAdd == 'true') {
      this.btnSaveTitle = this.utils.tr("Add");
      this.title =  this.utils.tr("NewActivityType");
      this.myObj = new ActivityType();
      this.myObj.workDay = true;
      this.myObj.billDay = false;
      this.myObj.congeDay = false;
      this.myObj.formaDay = false;
    } else {
      this.btnSaveTitle = this.utils.tr("Save");
      this.title = this.utils.tr("EditActivityType")
      let activityTypeP: ActivityType = this.activityTypeService.getActivityType();
      ////console.log('activityTypeP='+activityTypeP);

      if (activityTypeP != null) this.myObj = activityTypeP;
      else if (this.myObj == null) this.myObj = new ActivityType();

      this.esnService.majActivityType(this.myObj)
    }
  }

  onSubmit() {
    //////////console.log("onSubmit: myObj=", this.myObj);
    this.beforeCallServer("onSubmit");
    this.myObj.esn = this.myObj.esn == null ? this.getEsnCurrent() : null ;
    this.myObj.esnId = this.myObj.esn != null ? this.myObj.esn.id  : -1 ;
    
    this.activityTypeService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)

        if (!this.isError()) this.gotoActivityTypeList()
      },
      error => {
        //////////console.log("error:", error);
        this.addErrorFromErrorOfServer("onSubmit", error);
      }
    );
  }

  gotoActivityTypeList() {
    this.clearInfos();
    this.router.navigate(['/activityType_list']);
  }
  
}
