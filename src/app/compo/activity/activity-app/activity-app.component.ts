import { Component, ViewChild } from '@angular/core';
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

	error: MyError;
	currentUser: Consultant;

	@ViewChild('activityList', {static: false}) activityList: ActivityListComponent;

	constructor(public utils: UtilsService, public dataSharingService: DataSharingService) { 
		super(utils, dataSharingService)
		this.currentUser = dataSharingService.userConnected
	}

	ngOnInit() {
	}

	canViewActivities(): boolean {
		const role = this.currentUser?.role;
		return role === 'ADMIN' || role === 'RESPONSIBLE_ESN' || role === 'MANAGER';
	}

}
