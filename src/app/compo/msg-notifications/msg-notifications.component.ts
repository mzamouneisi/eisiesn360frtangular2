import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataSharingService } from "src/app/service/data-sharing.service";
import { UtilsService } from 'src/app/service/utils.service';
import { Consultant } from '../../model/consultant';
import { Msg } from '../../model/msg';
import { MsgService } from '../../service/msg.service';
import { MereComponent } from '../_utils/mere-component';

@Component({
  selector: 'app-msg-notifications',
  templateUrl: './msg-notifications.component.html',
  styleUrls: ['./msg-notifications.component.css']
})
export class MsgNotificationsComponent extends MereComponent {

	@Input() timeMs = 5000;
    modalRef: any;
	@ViewChild('tableNotifications', {static: true}) tableNotifications: TemplateRef<any>;

	userConnected: Consultant
	isShowListMsg = false;
	listMsg : Msg[];
	findNewMsgsId : any;

    constructor(private msgService: MsgService
    		, private router: Router
            , public utils: UtilsService
            , public dataSharingService: DataSharingService
    		, private modal: NgbModal) {
                super(utils, dataSharingService);
                this.userConnected = this.dataSharingService.userConnected
    }

  ngOnInit() {
	  this.findNewMsgsStart() ;
  }

  openModal(template: TemplateRef<any>) {
	  this.modalRef = this.modal.open(this.tableNotifications);
  }

  findNewMsgsStart() {
	  this.findNewMsgs();
	 // this.findNewMsgsId = setInterval( () => { this.findNewMsgs(); }, this.timeMs );
  }

  findNewMsgsEnd() {
	  if (this.findNewMsgsId) {
		    clearInterval(this.findNewMsgsId);
	  }
  }

  /**
   * list Msg tq: isReadTo = false and to = currentUser.
   */
  findNewMsgs() {
      this.beforeCallServer("findNewMsgs");
      this.msgService.findNewMsgsToConsultant(this.userConnected.id).subscribe(
          data => {
            this.afterCallServer("findNewMsgs", data)
            this.listMsg = data.body.result;
          }, error => {
            this.addErrorFromErrorOfServer("findNewMsgs", error);
          }
      );
  }


  showTarget(msg: Msg){
	  //isReadByTo = true
	  //obj = getObj(msg);
	  //edit msg
  }

  getObj(msg: Msg){
	  //selon msg.type, findObj (type, typeId);
  }

}
