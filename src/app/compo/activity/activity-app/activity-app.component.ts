import { Component, ViewChild } from '@angular/core';
import { SelectConsultantComponent } from "src/app/compo/_reuse/select-consultant/select-consultant.component";
import { ActivityListComponent } from "src/app/compo/activity/activity-list/activity-list.component";
import { MyError } from 'src/app/resource/MyError';
import { UtilsService } from 'src/app/service/utils.service';
import { Consultant } from "../../../model/consultant";
import { DataSharingService } from "../../../service/data-sharing.service";
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-activity-app',
  templateUrl: './activity-app.component.html',
  styleUrls: ['./activity-app.component.css']
})
export class ActivityAppComponent extends MereComponent {

	selectConsultantLabel: string = "app.compo.activity.select.consultant.title"
	error: MyError;

	currentUser: Consultant 

@ViewChild('listActivityOfMyConsultant', {static: false}) listActivityOfMyConsultant: ActivityListComponent;
@ViewChild('selectConsultantCompo', {static: false}) selectConsultantCompo: SelectConsultantComponent;

  constructor(public utils: UtilsService, public dataSharingService: DataSharingService) { 
    super(utils, dataSharingService)
    this.currentUser = dataSharingService.userConnected
   }

  ngOnInit() {
  }

  onSelectConsultant() {
	    this.refreshChild();
 }

  refreshChild() {

	    if (this.listActivityOfMyConsultant != null) {
	        this.listActivityOfMyConsultant.consultant = this.selectConsultantCompo.elementSelected;
	        this.listActivityOfMyConsultant.ngOnInit()
	    }
  }

}
