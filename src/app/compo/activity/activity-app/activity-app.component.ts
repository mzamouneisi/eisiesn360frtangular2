import {Component, OnInit, ViewChild} from '@angular/core';
import {DataSharingService} from "../../../service/data-sharing.service";
import {MyError} from 'src/app/resource/MyError';
import {SelectConsultantComponent} from "src/app/compo/_reuse/select-consultant/select-consultant.component";
import {ActivityListComponent} from "src/app/compo/activity/activity-list/activity-list.component";
import {Consultant} from "../../../model/consultant";
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-activity-app',
  templateUrl: './activity-app.component.html',
  styleUrls: ['./activity-app.component.css']
})
export class ActivityAppComponent implements OnInit {

	selectConsultantLabel: string = "app.compo.activity.select.consultant.title"
	error: MyError;

	currentUser: Consultant = DataSharingService.userConnected;

@ViewChild('listActivityOfMyConsultant', {static: false}) listActivityOfMyConsultant: ActivityListComponent;
@ViewChild('selectConsultantCompo', {static: false}) selectConsultantCompo: SelectConsultantComponent;

  constructor(private dataSharingService: DataSharingService, public utils: UtilsService) {  }

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

  isConsultant(): boolean {
	  return this.dataSharingService.isConsultant() ;
  }

}
