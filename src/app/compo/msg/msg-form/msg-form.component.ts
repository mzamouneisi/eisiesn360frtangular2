import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDatePickerConfig, IDatePickerDirectiveConfig } from 'ng2-date-picker';
import {UtilsService} from 'src/app/service/utils.service';
import { MsgService } from '../../../service/msg.service';
import { Msg } from '../../../model/msg';
import { MereComponent } from '../../_utils/mere-component';
import { DataSharingService } from 'src/app/service/data-sharing.service';

@Component({
  selector: 'app-msg-form',
  templateUrl: './msg-form.component.html',
  styleUrls: ['./msg-form.component.css']
})
export class MsgFormComponent extends MereComponent {

	title:string = "Msg Form"
	btnSaveTitle: string = "Add"
	isAdd: string ;
 
 @Input()
  myObj: Msg;
  
  dateOptions: IDatePickerDirectiveConfig  = {format: "YYYY-MM-DDTHH:mm:ss.SSSZ",};
 
  constructor(private route: ActivatedRoute, private router: Router, private msgService: MsgService     , public utils: UtilsService
    , protected dataSharingService: DataSharingService) {
      super(utils, dataSharingService);

  }
  
  ngOnInit() {
	this.initByMsg();
  }

  initByMsg() {

	////console.log('initByMsg')
	if (this.isAdd == null) {
		this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
	}
	////console.log(isAdd)

	if(this.isAdd == 'true') {
		this.btnSaveTitle = "Add"
		this.title = "Nouveau Msg"
		this.myObj = new Msg();
	}else {
		this.btnSaveTitle = "Save"
		this.title = "Edit Msg"
		let msgP:Msg = this.msgService.getMsg();
		////console.log('msgP='+msgP);
		
		if (msgP != null) this.myObj = msgP;
		else if(this.myObj == null) this.myObj = new Msg();  
	}
  }
 
  onSubmit() {
    ////console.log(this.myObj);
    this.beforeCallServer("onSubmit");
    this.msgService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)
        
        if (!this.isError()) this.gotoMsgList()
      },
      error => {
        this.addErrorFromErrorOfServer("onSubmit", error);
        ;
      }
    );
  }

 
  gotoMsgList() {
    this.clearInfos();
    this.router.navigate(['/msg_list']);
  }
}
